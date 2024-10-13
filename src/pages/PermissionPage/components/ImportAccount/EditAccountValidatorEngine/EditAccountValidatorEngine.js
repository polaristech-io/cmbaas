import ecc from 'eosjs-ecc';

export default function editValidate(values) {
  let errors = {};

  if (!values.publicKey || values.publicKey.length === 0) {
    errors.publicKey = '公钥为必填项';
  } else if (!ecc.isValidPublic(values.publicKey)) {
    errors.publicKey = '公钥不是有效的 EOSKey'
  }

  if (!values.privateKey || values.privateKey.length === 0) {
    errors.privateKey = '私钥为必填项';
  } else if (!ecc.isValidPrivate(values.privateKey)) {
    errors.privateKey = '私钥不是有效的 WIF（钱包导入格式）';
  } else if (!(ecc.privateToPublic(values.privateKey) === values.publicKey)) {
    errors.privateKey = '私钥签名与公钥不匹配';
  }
  return errors;
}
