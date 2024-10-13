import './InfoPage.scss';

import React, { Component } from 'react';
import { CardBody, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';

import { StandardTemplate } from 'templates';
import Headblock from './components/Headblock';
import BlockchainInfo from './components/BlockchainInfo';
import LastIrreversibleBlockInfo from './components/LastIrreversibleBlockInfo';
import WelcomePopup from './components/WelcomePopup';
import { CardStyled, CardHeaderStyled, PageTitleDivStyled, InputStyled} from 'styled';
import styled from 'styled-components';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`

class InfoPage extends Component {

  constructor(props) {
    super(props);
    if (navigator.userAgent === 'ReactSnap') {
      this.state = {
        modalIsOpen: false
      }
    } else {
      this.state = {
        modalIsOpen: (!this.props.showWelcomePopup) ? this.props.sessionShowWelcomePopup : false
      }
    }

  }

  toggleModal () {
    this.setState({
      modalIsOpen: !this.state.modalIsOpen
    });
  }

  render() {

    return (
      <StandardTemplate>
        <div className="InfoPage">
          <Row>
            <Col xs="12">
              <PageTitleDivStyled>信息页面</PageTitleDivStyled>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <FirstCardStyled>
                <CardHeaderStyled>
                  连接
                </CardHeaderStyled>
                <CardBody>
                  <InputStyled
                    type="text"
                    defaultValue={this.props.nodeos}
                    disabled
                  />
                </CardBody>
              </FirstCardStyled>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <CardStyled>
                <CardHeaderStyled>
                  区块链资讯
                </CardHeaderStyled>
                <CardBody>
                  <BlockchainInfo />
                </CardBody>
              </CardStyled>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <CardStyled>
                <CardHeaderStyled>
                  头块信息
                </CardHeaderStyled>
                <CardBody>
                  <Headblock/>
                </CardBody>
              </CardStyled>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <CardStyled>
                <CardHeaderStyled>
                  最后不可逆区块信息
                </CardHeaderStyled>
                <CardBody>
                  <LastIrreversibleBlockInfo />
                </CardBody>
              </CardStyled>
            </Col>
          </Row>
        </div>
        {
          this.state.modalIsOpen ? (
            <WelcomePopup
              toggle={()=>{
                this.toggleModal();
              }}
              open={this.state.modalIsOpen}
              />)
              : null
        }
      </StandardTemplate>
    );
  }
}

export default connect(
  ({
    infoPage: {
      welcomePopupState: {
        showWelcomePopup,
        sessionShowWelcomePopup
      }
    },
    endpoint: {path: { nodeos }}
  } 
  ) => ({
    showWelcomePopup,
    sessionShowWelcomePopup,
    nodeos
  }),
  null
)(InfoPage);
