import React from 'react';

import { connect } from 'react-redux';

import { Col, Form, FormGroup, Label } from 'reactstrap';

import isObjectEmpty from 'helpers/is-object-empty';
import { pollingStart } from 'reducers/headblock';
import { LoadingSpinner } from 'components';
import { ErrorButton } from 'styled';

const Headblock = (props) => {

  let { headblock: { isPolling, data }} = props;
  let { payload : [{block_num, block_id, producer, timestamp}={}]= [], error } = data;

  return (
    <>
      { error ?
        <>
          {!isObjectEmpty(error) && <p className="text-danger">{JSON.stringify(error)}</p>}
          <ErrorButton onClick={props.pollingStart}>连接错误，点击重新加载</ErrorButton>
        </>
      : isPolling ? (
        <LoadingSpinner />
      ) : (
        <Form className="form-horizontal">
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>区块编号:</Label>
            </Col>
            <Col xs="10" className="hashText">
              <p className="form-control-static">{block_num}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>区块ID:</Label>
            </Col>
            <Col xs="10" className="hashText">
              <p style={{textTransform: "lowercase"}} className="form-control-static">{block_id}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>时间:</Label>
            </Col>
            <Col xs="10" className="hashText">
              <p className="form-control-static">{timestamp}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>区块登陆者:</Label>
            </Col>
            <Col xs="10" className="hashText">
              <p className="form-control-static">{producer}</p>
            </Col>
          </FormGroup>
      </Form>
      )}
    </>
  );
}

export default connect(
  ({ headblock }) => ({
    headblock
  }),
  {
    pollingStart
  }

)(Headblock);
