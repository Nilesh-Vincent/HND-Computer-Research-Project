import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listOrders } from "../actions/orderActions";
import pdfMake from "pdfmake/build/pdfmake";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [disable, SetDisable] = useState(true);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  const handlePdfExport = async () => {
    await SetDisable(false);
    await html2canvas(document.getElementById("table")).then((canvas) => {
      const data = canvas.toDataURL();
      const pdfExportSetting = {
        content: [
          {
            image: data,
            width: 500,
          },
        ],
      };
      SetDisable(true);
      pdfMake.createPdf(pdfExportSetting).download("order List");
    });
  };
  return (
    <>
      <div>
        <Row className="align-items-center">
          <Col>
            <h1>All Orders</h1>
          </Col>
          <Col className="text-right">
            <Link to="/admin/paid">
              <Button variant="info" className="float-end buttton-padding">
                Have to mark as Delivered
              </Button>
            </Link>
            <Link to="/admin/notpaid">
              <Button variant="warning" className="float-end buttton-padding">
                Not paid orders by Customer
              </Button>
            </Link>
          </Col>
        </Row>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Table
            striped
            bordered
            hover
            responsive
            className="table-sm"
            id="table"
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  {disable && (
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant="light" className="btn-sm">
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
      <br />
      <div>
        <Button
          style={{ borderRadius: 5 }}
          variant="danger"
          onClick={handlePdfExport}
        >
          {disable ? "download" : "please wait"}
        </Button>
      </div>
    </>
  );
};

export default OrderListScreen;
