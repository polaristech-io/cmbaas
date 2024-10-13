import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Transactiondetail from './components/Transactiondetail';
import { PageTitleDivStyled } from 'styled';

class TransactiondetailPage extends Component {

  render() {
    return (
      <StandardTemplate>
        <div className="TransactiondetailPage">
          <Row>
            <Col sm="12">
              <PageTitleDivStyled>交易 | 交易详情页面</PageTitleDivStyled>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <Transactiondetail/>
            </Col>
          </Row>
        </div>
      </StandardTemplate>
    );
  }
}
export default TransactiondetailPage;
