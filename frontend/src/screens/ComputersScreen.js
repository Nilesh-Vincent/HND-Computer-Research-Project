import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
// import Meta from '../components/Meta'
import { listComputers } from "../actions/productActions";

const ComputersScreen = () => {
  const dispatch = useDispatch();

  const productComputers = useSelector((state) => state.productComputers);
  const { loading, error, products } = productComputers;

  useEffect(() => {
    dispatch(listComputers());
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Row>
      <h1>
        <center>
          <br />
          Laptops & Computers
        </center>
      </h1>
      {products.map((product) => (
        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
          <Link to={`/product/${product._id}`}>
            <Product product={product} />
          </Link>
        </Col>
      ))}
    </Row>
  );
};

export default ComputersScreen;
