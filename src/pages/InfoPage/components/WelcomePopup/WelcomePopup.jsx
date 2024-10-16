import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CardStyled, ButtonPrimary, PageTitleDivStyled, CheckBoxDivStyled } from 'styled';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { toggleShowAgain, toggleSessionShowAgain } from './WelcomePopupReducer';

const InfoModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  z-index: 1021;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1030;
  top: 0;
  left: 0;
  background: #443f54;
  opacity: 0.9;
`

const WelcomeModalCard = styled(CardStyled)`
  position: relative;
  z-index: 1050;
  padding: 18px 24px;
  max-width: 745px;
  min-height: 367px;
`

const CloseButton = styled.button`
  position: absolute;
  top: 9px;
  right: 13px;
  border: none;
  background: transparent;
  padding: 10px;
  &:hover {
    cursor: pointer;
  }
`

const InfoPortal = ({ children }) => {
  const modalRoot = document.getElementById('modal');
  const el = document.createElement('div');

  useEffect(() => {
    modalRoot.appendChild(el);
  });

  useEffect(() => {
    return () => modalRoot.removeChild(el);
  })

  return createPortal(children, el);
}

const WelcomePopup = ({ toggle, open, toggleShowAgain }) => {

  const closeModal = () => {
    const doNotShowAgain = document.getElementById('toggleCheck').checked;
    toggleShowAgain(doNotShowAgain);
    toggleSessionShowAgain(false);
    toggle();
  }

  return (
    <InfoPortal>
      {
        open && (
          <InfoModalWrapper>
            <WelcomeModalCard>
              <CloseButton onClick={() => closeModal()}>
                <img src="https://icon.now.sh/x/8ba5bf" alt="关闭" />
              </CloseButton>
              <PageTitleDivStyled>
                欢迎来到 cmcc™：EOSIO Explorer
              </PageTitleDivStyled>
              <p>
			    cmcc™: EOSIO Explorer 是一款开源浏览器，用于在图形界面中观察 EOSIO 区块链的活动，以及一组加速 EOSIO 智能合约和应用程序开发的开发工具。
              </p>
              <p>
				使用 cmcc™：EOSIO Explorer，您可以查看 EOSIO 区块链上的块、交易和操作，管理开发人员帐户和与其关联的权限，上传Smart协议并与Smart协议交互等。
              </p>
              <p>
				如果您有任何反馈或者您想为 cmcc™ 的源代码做出贡献：EOSIO Explorer - 请关注我们的 GitHub 存储库：<a href="https://github.com/EOSIO/eosio-explorer" target="_blank" rel="noopener noreferrer">https://github.com/EOSIO/eosio-explorer</a>
              </p>
              <CheckBoxDivStyled style={{marginTop: '31px'}}>
                <label className="checkboxContainer">
                  不再显示此消息
                  <input id="toggleCheck" type="checkbox"/>
                  <span className="checkmark"></span>
                </label>
              </CheckBoxDivStyled>
              <ButtonPrimary
                onClick={() => closeModal()}
                style={{
                  position: 'absolute',
                  bottom: '21px',
                  right: '19px'
                }}>
                确定
              </ButtonPrimary>
            </WelcomeModalCard>
            <Background />
          </InfoModalWrapper>
        )
      }
    </InfoPortal>
  )
}

export default connect(
  null,
  {
    toggleShowAgain,
    toggleSessionShowAgain
  }
)(WelcomePopup);
