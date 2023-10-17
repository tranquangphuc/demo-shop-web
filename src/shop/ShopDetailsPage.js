import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useLoaderData, useNavigate } from "react-router-dom";
import { PaginationControl, fromSpringPage } from "../ui/PaginationControl";
import { ShopForm } from "./ShopForm";

export default function ShopDetailsPage() {
  const [data, setData] = useState(useLoaderData());
  console.log(data);
  const navigate = useNavigate();
  const saveShop = async (formData) => {
    if (formData.id) {
      console.debug("update shop", formData);
      await axios.put(`/api/shops/${formData.id}`, formData);
      navigate(-1);
    } else {
      console.debug("create shop", formData);
      await axios.post(`/api/shops`, formData);
      navigate(-1);
    }
  };
  const [shopProducts, setShopProducts] = useState();
  const loadShopProducts = (page) => {
    let params = { page };
    axios
      .get(`/api/shops/${data.id}/products`, { params })
      .then((res) => setShopProducts(res.data));
  };
  useEffect(() => {
    if (data?.id) {
      loadShopProducts();
    }
  }, []);
  return (
    <Container>
      <Row>
        <Col>
          <ShopForm data={data} onSubmit={saveShop} />
          {data?.id && shopProducts && (
            <>
              <hr />
              <h3>Shop Products List</h3>
              <PaginationControl
                pageable={fromSpringPage(shopProducts)}
                onClick={loadShopProducts}
              />
              <ShopProductList items={shopProducts?.content} />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

function ShopProductList({ items }) {
  return (
    <Row xs={1} md={2} lg={3} xl={4} className="g-4">
      {items &&
        items.map((i) => (
          <Col key={i.id}>
            <ShopProduct item={i} />
          </Col>
        ))}
    </Row>
  );
}

function ShopProduct({ item }) {
  return (
    <Card>
      {item.imageUrl && (
        <Card.Img variant="top" src={`/api/files/${item.imageUrl}`} />
      )}
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Price: {item.price}</ListGroup.Item>
      </ListGroup>
      {/* <Card.Footer className="text-muted"></Card.Footer> */}
    </Card>
  );
}
