import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Col, Form, FormGroup, Label } from 'reactstrap';

const Actiondetail = (props) => {

  let { actiondetailPage: { data } } = props;
  let { payload } = data;

  return (
    <>
      { payload.map((action, index) =>
        <Form key={index} className="form-horizontal">
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>Smart协议名称:</Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static hashText">{action && action.act_account}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>操作类型:</Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static hashText">{action && action.act_name}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>时间:</Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static hashText">{action && action.timestamp}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>交易ID:</Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static hashText">
                {action && <Link to={`/transaction/${action.transaction_id}`}>{action.transaction_id}</Link> }
              </p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>参与者:</Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static hashText">
                { action && action.action_data.authorization[0].actor }
              </p>
            </Col>
          </FormGroup>
        </Form>      
      )}
    </>
  );
}

export default connect(
  ({ actiondetailPage, router}) => ({
    actiondetailPage,
    router
  })
)(Actiondetail);
