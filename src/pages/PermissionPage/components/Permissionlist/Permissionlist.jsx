import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { CardBody, Table } from 'reactstrap';
import cogoToast from 'cogo-toast';
import { LoadingSpinner } from 'components';
import { connect } from 'react-redux';
import { fetchStart, accountImport, defaultSet } from 'reducers/permission';
import { panelSelect } from 'pages/PermissionPage/PermissionPageReducer';
import { RadioButtonDivStyled, CardStyled, CardHeaderStyled, ButtonPrimary, InfoDivStyled } from 'styled';

const PermissionTable = styled(Table)`
  tr {
    border: solid 1px #e8ebf0;
  }

  tbody:nth-of-type(even) {
    background-color: #fbfbfc;
  }
`
const EditButtonCell = styled.td`
  vertical-align: middle !important;
`
const PermissionLink = styled(Link)`
  :hover {
    font-weight: strong;
    color: 4d9cc3;
  }
`
const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`

const Permissionlist = (props) => {

  let { 
    permission: { isFetching, data },
    panelSelect, defaultSet 
  } = props;
  let { list, defaultId } = data;
  let clonedList = list.slice(0);  

  //Seperate Permissions based on Private keys
  let listWithPrivateKey = [];
  let listWithoutPrivateKey = [];
  clonedList.map(eachPermission => {
    if(eachPermission.private_key !== undefined && eachPermission.private_key !== "" && eachPermission.private_key !== null){
      listWithPrivateKey.push(eachPermission);
    }else{      
      listWithoutPrivateKey.push(eachPermission);
    }
    return null;
  });

  useEffect(()=>{
    props.fetchStart();
  }, [])

  function getKeysData (permissionObj, list, panel) {
    const keysData = list.filter(acct => acct["account"] === permissionObj.account);   
    let editOrImportPermission = keysData.filter(eachPermission => eachPermission.permission === permissionObj.permission );
    props.accountImport(editOrImportPermission);
    panelSelect("import-account-"+panel);
  }

  function setAsDefault (accName, permission) {
    let msg = `成功将 ${accName}@${permission} 设置为默认账户`;
    defaultSet(accName+"@"+permission);
    if (defaultId !== accName+"@"+permission)
      cogoToast.success(msg, {
        heading: '账户已更改',
        position: 'bottom-center',
        hideAfter: 2
      });
  }
  return (
    <div className="Permissionlist">

      <div>{ isFetching   ? <LoadingSpinner />
                          : <div>
                              <FirstCardStyled>
                                <CardHeaderStyled>
                                  默认签名账户
                                </CardHeaderStyled>
                                <CardBody>
                                  <InfoDivStyled>
                                    这些是您当前可用的账户，拥有公钥和私钥。 
                                    它们可用于签署交易和推送操作。
                                    <b>eosio</b> 账户拥有负责众多重要功能的系统协议，因此请注意，您无法在该权限下在本地部署新协议。 
                                    如果您想更新或检查这些账户的密钥，请单击“编辑”按钮。 
                                    单击单选按钮设置用于授权操作的默认账户。
                                  </InfoDivStyled>
                                  <PermissionTable borderless>
                                    {
                                      listWithPrivateKey.length > 0 
                                        ? listWithPrivateKey.map((eachPermission) => (
                                            <tbody className="accountRow" key={eachPermission.account+""+eachPermission.permission}> 
                                              <tr key={eachPermission.account+"@"+eachPermission.permission}>
                                                <td width="7%">
                                                  <div style={{marginTop: "14px"}}>                                                
                                                    <RadioButtonDivStyled>
                                                      <label className="radioContainer">
                                                        <input name={eachPermission.account+"@"+eachPermission.permission}
                                                          type="radio"
                                                          checked={eachPermission.account+"@"+eachPermission.permission === defaultId ? true : false}
                                                          onClick={() => setAsDefault( 
                                                            eachPermission.account, 
                                                            eachPermission.permission)}
                                                          readOnly />
                                                        <span className="checkmark"></span>
                                                      </label>
                                                    </RadioButtonDivStyled>  
                                                  </div>                                                  
                                                </td>  
                                                <td width="53%">
                                                  <div style={{marginTop: "6px"}}>
                                                    <PermissionLink to={`/account/${eachPermission.account}`}>
                                                      {eachPermission.account}@{eachPermission.permission}
                                                    </PermissionLink>
                                                  </div>                                            
                                                </td>
                                                <EditButtonCell width="40%">
                                                  <ButtonPrimary 
                                                        style={{float:'right', marginRight:'5%'}}
                                                        onClick={() => getKeysData(eachPermission, list, "edit")}                                                        
                                                        block
                                                        >
                                                        编辑
                                                      </ButtonPrimary>
                                                </EditButtonCell>
                                              </tr>
                                            </tbody>
                                      ))
                                      : <tbody>
                                        <tr>
                                          <td width="100%" style={{textAlign:"center"}}>
                                            <strong>没有可用账户</strong>
                                          </td>
                                        </tr>
                                      </tbody>
                                    }
                                  </PermissionTable>
                                </CardBody>
                              </FirstCardStyled>                              
                              { (listWithoutPrivateKey.length > 0) 
                                ? <FirstCardStyled>
                                  <CardHeaderStyled>导入账户</CardHeaderStyled>
                                  <CardBody>
                                    <InfoDivStyled>
                                      此面板中的账户尚未分配私钥。 
                                      您可以单击“导入密钥”按钮将您的私钥分配给这些账户。 
                                      <b>注意：</b>请确保您导入到此处账户的私钥与从 PostgresDB 获取的公钥相对应。否则，即使导入密钥，您也将无法对它们执行任何操作。
                                    </InfoDivStyled>
                                    <PermissionTable borderless>
                                    {
                                      listWithoutPrivateKey.map((eachPermission) => (
                                        <tbody className="accountRow" key={eachPermission.account+""+eachPermission.permission}>
                                          <tr key={eachPermission.permission}>
                                            <td width="2%"></td>
                                            <td width="58%" style={{verticalAlign: "middle"}}>
                                              <PermissionLink to={`/account/${eachPermission.account}`}>
                                                {eachPermission.account}@{eachPermission.permission}
                                              </PermissionLink>                                              
                                            </td>
                                            <EditButtonCell width="40%">
                                              <ButtonPrimary 
                                                    style={{float:'right', marginRight:'5%'}}
                                                    onClick={() => getKeysData(eachPermission, list, "importer")}
                                                    block
                                                    >
                                                    导入密钥
                                                  </ButtonPrimary>
                                            </EditButtonCell> 
                                          </tr>
                                        </tbody>
                                      ))
                                    }
                                  </PermissionTable>
                                  </CardBody>
                                </FirstCardStyled>
                                : null
                              }
                            </div>
              }
      </div>
    </div>
  );
}

export default connect(
  ({ permission, permissionPage: { panel } }) => ({
    permission, panel
  }),
  {
    fetchStart,
    defaultSet,
    accountImport,
    panelSelect
  }
)(Permissionlist);
