export default function validate(values) {
  let errors = {};

  if (!values.accountName || values.accountName.length === 0) {
    errors.accountName = '账户名称为必填项';
  } else if (!/^([a-z1-5][a-z1-5.]+)$/.test(values.accountName)) {
    let errorString = "EOSIO 账户名无效: ";
    let reasons = [];

    if (/[A-Z]/.test(values.accountName)) {
      reasons.push("名称包含大写字母");
    }

    if (/[6-9]/.test(values.accountName)) {
      let numbers = [];
      if (values.accountName.includes("6")) numbers.push(6);
      if (values.accountName.includes("7")) numbers.push(7);
      if (values.accountName.includes("8")) numbers.push(8);
      if (values.accountName.includes("9")) numbers.push(9);
      reasons.push("名称包含以下数字: " + numbers.join(','));
    }

    errors.accountName = errorString + reasons.join(', ');
  }

  return errors;
}
