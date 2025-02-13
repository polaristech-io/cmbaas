import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { Col, Form, FormGroup, Label } from 'reactstrap';

import isObjectEmpty from 'helpers/is-object-empty';
import { fetchStart } from './BlockchainInfoReducer';
import { LoadingSpinner } from 'components';
import { ErrorButton } from 'styled';

const BlockchainInfo = (props) => {

  useEffect(()=>{
    props.fetchStart();
  }, [])

  let { blockchainInfo: { isFetching, data }} = props;
  let { payload = {}, error } = data;
  
  return (
    <>
      { error ?
        <>
          {!isObjectEmpty(error) && <p className="text-danger">{JSON.stringify(error)}</p>}
          <ErrorButton onClick={props.fetchStart}>连接错误，点击重新加载</ErrorButton>
        </>
      : isFetching ? (
        <LoadingSpinner />
      ) : (
        <Form className="form-horizontal">
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>服务器版本:</Label>
            </Col>
            <Col xs="10" className="hashText">
              <p className="form-control-static">{payload && payload.server_version}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>服务器版本字符串:</Label>
            </Col>
            <Col xs="10" className="hashText">
              <p className="form-control-static">{payload && payload.server_version_string}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>链ID:</Label>
            </Col>
            <Col xs="10" className="hashText">
              <p className="form-control-static hashText">{payload && payload.chain_id}</p>
            </Col>
          </FormGroup>
        </Form>
      )}
    </>
  );
}

export default connect(
  ({ infoPage: { blockchainInfo }}) => ({
    blockchainInfo
  }),
  {
    fetchStart,
  }

)(BlockchainInfo);
