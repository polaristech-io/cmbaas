import React, { Component } from 'react';
import { 
  Row, Col
} from 'reactstrap';
import cogoToast from 'cogo-toast';

import { StandardTemplate } from 'templates';
import { connect } from 'react-redux';

import BasicModal from 'components/BasicModal';
import CreateAccount from './components/CreateAccount';
import Permissionlist from './components/Permissionlist';
import ImportAccount from './components/ImportAccount';

import { panelSelect } from './PermissionPageReducer';
import { fetchStart, accountClear } from 'reducers/permission';
import styled from 'styled-components';
import { PageTitleDivStyled, ButtonGroupSeperated, ButtonPrimary, ButtonSecondary, ToolTipStyled, ErrorDivStyled } from 'styled';

const CustomButtonPrimary = styled(ButtonPrimary)`
  padding-top: 4px;
  line-height: 15px;
`

const CustomButtonSecondary = styled(ButtonSecondary)`
  padding-top: 4px;
  line-height: 15px;
`

const CustomErrorDiv = styled(ErrorDivStyled)`
  padding: 30px 0 0 0;
`

class PermissionPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      resetTooltip: false,
      createTooltip: false,
      modalIsOpen: false
    }

    props.panelSelect("permission-list");
    window.scrollTo(0,0);

  } 

  toggleResetTooltip () {
    this.setState({
      resetTooltip: !this.state.resetTooltip
    })
  };

  toggleModal () {
    this.setState({
      modalIsOpen: !this.state.modalIsOpen
    })
  };

  render() {

    const { panelSelect, panel, accountClear, fetchStart, payload } = this.props;
    const { chain_id } = payload || { chain_id: "NONE" };

    // Initialize local redux store state, then re-fetch PostgresDB permissions
    function reInitialize () {
      accountClear();
      fetchStart();
      cogoToast.success("成功重新初始化本地存储状态", {
        heading: '账户存储重新初始化',
        position: 'bottom-center'
      });
    }

    // Change panel 
    function changePanel (panel) {
      panelSelect(panel);
    }
    
    return (
      <StandardTemplate>
        <div className="PermissionPage ">          
          <Row>
            <Col sm="12">
              <Row>
                <Col sm="12">
                  <PageTitleDivStyled>管理账户页面</PageTitleDivStyled>
                </Col>
              </Row>
              <Row>
                {
                  (chain_id !== 'NONE' )
                  ? (<Col sm={12}>
                    <ButtonGroupSeperated className="float-right"
                      style={{display: (panel === "permission-list") ? 'block' : 'none'}}>
                      <CustomButtonPrimary id="CreateAccountBtn" onClick={()=>{changePanel("create-account")}}>创建账户</CustomButtonPrimary>
                      <CustomButtonSecondary id="ResetPermissionBtn" onClick={()=>this.toggleModal()}>重置所有权限</CustomButtonSecondary>
                    </ButtonGroupSeperated>
                    <ToolTipStyled placement="bottom" target="ResetPermissionBtn"
                      isOpen={this.state.resetTooltip && panel === "permission-list"}
                      toggle={()=>this.toggleResetTooltip()}
                      delay={{show: 0, hide: 0}}
                      trigger="hover"
                      autohide={true}>
                      所有私钥都存储在您的本地计算机上。单击此按钮会将本地存储恢复到默认状态。这意味着您当前存储的所有私钥都将被清除！
                    </ToolTipStyled>
                  </Col>)
                  : null
                }
              </Row>
              <br/>
              <Row>
                {
                  (chain_id !== 'NONE') 
                  ? (<Col sm={12}>
                    { panel === "permission-list" ? <Permissionlist/>
                      : panel === "create-account" ? <CreateAccount/>
                      : <ImportAccount />
                    }
                    </Col>)
                  : (<Col sm={12}>
                    <CustomErrorDiv>目前未连接任何区块链，无法显示账户</CustomErrorDiv>
                  </Col>)
                }
              </Row>
            </Col>
          </Row>
        </div>
        {
          this.state.modalIsOpen && (
            <BasicModal header="Confirmation to Reset all Permissions"
              toggle={()=>this.toggleModal()}
              open={this.state.modalIsOpen}
              handleConfirm={()=>{this.toggleModal(); reInitialize();}}
              >
              您确定要重置所有权限吗？您将<b>永久</b>丢失本地存储中的所有私钥！
            </BasicModal>
          )
        }
      </StandardTemplate>
    );
  }
}

export default connect(
  ({ permission, permissionPage: { panel }, infoPage: { blockchainInfo: { data: { payload } }} }) => ({
    permission, panel, payload
  }),
  {
    panelSelect,
    fetchStart,
    accountClear
  }
)(PermissionPage);
