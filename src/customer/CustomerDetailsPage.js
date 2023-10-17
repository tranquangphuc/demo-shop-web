import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import { CustomerForm } from "./CustomerForm";
import { PaginationControl, fromSpringPage } from "../ui/PaginationControl";

export default function CustomerDetailsPage() {
  const [data, setData] = useState(useLoaderData());
  const navigate = useNavigate();
  console.log(data);
  const saveCustomer = async (formData) => {
    if (formData.id) {
      console.debug("update customer", formData);
      await axios.put(`/api/customers/${formData.id}`, formData);
      navigate(-1);
    } else {
      console.debug("create customer", formData);
      await axios.post(`/api/customers`, formData);
      navigate(-1);
    }
  };
  const [orderedProducts, setOrderedProducts] = useState();
  const [queryParams, setQueryParams] = useState({});
  const loadOrderedProducts = (page) => {
    let params = { ...queryParams, page };
    setQueryParams(params);
    axios
      .get(`/api/customers/${data.id}/orders`, { params })
      .then((res) => setOrderedProducts(res.data));
  };
  const orderProduct = (productId) => {
    axios
      .post(`/api/customers/${data.id}/orders`, {
        productId,
        customerId: data.id,
      })
      .then(() => loadOrderedProducts(queryParams?.page));
  };
  useEffect(() => {
    if (data?.id) {
      loadOrderedProducts();
    }
  }, []);
  return (
    <Container>
      <Row>
        <Col>
          <CustomerForm data={data} onSubmit={saveCustomer} />
          {data?.id && (
            <>
              <hr />
              <h3>Order New Product</h3>
              <CreateOrderItem onSubmit={orderProduct} />
              {orderedProducts && (
                <>
                  <hr />
                  <h3>Ordered Products List</h3>
                  <PaginationControl
                    pageable={fromSpringPage(orderedProducts)}
                    onClick={loadOrderedProducts}
                  />
                  <OrderedItemsList items={orderedProducts?.content} />
                </>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

function CreateOrderItem({ onSubmit }) {
  const [product, setProduct] = useState();
  const [foundProducts, setFoundProduct] = useState([]);
  const { register, setValue, watch } = useForm();
  const searchProduct = (event) => {
    let text = event.target.value;
    console.debug("search product text", text);
    setValue("productSelect", null);
    fetch(`/api/products?name=${text}`)
      .then((res) => res.json())
      .then((json) => setFoundProduct(json.content));
  };
  const selectedProductId = watch("productSelect");
  useEffect(() => {
    if (selectedProductId) {
      let id = parseInt(selectedProductId);
      console.debug("select product id", id);
      let product = foundProducts.find((p) => p.id === id);
      setProduct(product);
    }
  }, [selectedProductId]);
  const orderProduct = () => {
    onSubmit(parseInt(selectedProductId));
  };
  return (
    <div>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Search Product</Form.Label>
          <Form.Control
            type="text"
            placeholder="Name"
            onChange={searchProduct}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Select Product to order</Form.Label>
          <Form.Select {...register("productSelect")}>
            <option>Select a product</option>
            {foundProducts &&
              foundProducts.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
          </Form.Select>
        </Form.Group>
      </Form>
      {product && (
        <Card style={{ maxWidth: 400 }}>
          {product.imageUrl && (
            <Card.Img variant="top" src={`/api/files/${product.imageUrl}`} />
          )}
          <Card.Body>
            <Card.Title>{product.name}</Card.Title>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>{product.price}</ListGroup.Item>
            <ListGroup.Item>{product?.shop?.name}</ListGroup.Item>
            <ListGroup.Item>{product?.shop?.address}</ListGroup.Item>
          </ListGroup>
          <Card.Footer className="text-muted">
            <Button onClick={orderProduct}>Order</Button>
          </Card.Footer>
        </Card>
      )}
    </div>
  );
}

function OrderedItemsList({ items }) {
  return (
    <Row xs={1} md={2} lg={3} xl={4} className="g-4">
      {items &&
        items.map((i) => (
          <Col key={[i.id, i.shop.id, i.orderedDate]}>
            <OrderedItems item={i} />
          </Col>
        ))}
    </Row>
  );
}

function OrderedItems({ item }) {
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
        <ListGroup.Item>Shop: {item.shop.name}</ListGroup.Item>
        <ListGroup.Item>Address: {item.shop.address}</ListGroup.Item>
      </ListGroup>
      <Card.Footer className="text-muted">{item.orderedDate}</Card.Footer>
    </Card>
  );
}
