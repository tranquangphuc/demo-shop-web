import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Image, Stack, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useLoaderData } from "react-router-dom";
import { PaginationControl, fromSpringPage } from "../ui/PaginationControl";
import ProductSearchForm from "./ProductSearchForm";

export default function ProductMasterPage() {
  const deleteProduct = (id) => {
    console.debug("delete product", id);
    axios
      .delete(`/api/products/${id}`)
      .then((res) => setUpdateTime(Date.now()));
  };
  const [updateTime, setUpdateTime] = useState(Date.now());
  const [data, setData] = useState(useLoaderData());
  const [queryParams, setQueryParams] = useState({});

  const loadProducts = (page) => {
    let params = { ...queryParams, page };
    axios.get("/api/products", { params }).then((res) => {
      setQueryParams(params);
      setData(res.data);
    });
  };
  const searchProducts = (formData) => {
    let params = { ...queryParams, page: 0, ...formData };
    axios.get("/api/products", { params }).then((res) => {
      setQueryParams(params);
      setData(res.data);
    });
  };
  const reloadProducts = () => {
    setQueryParams({});
    axios.get("/api/products", {}).then((res) => {
      setData(res.data);
    });
  };

  useEffect(() => loadProducts(), [updateTime]);

  return (
    <Stack>
      <Stack direction="horizontal" gap={3} className="mb-3">
        <LinkContainer to="/products/new">
          <Button variant="primary">Create New Product</Button>
        </LinkContainer>
        <div className="vr" />
        <ProductSearchForm onSubmit={searchProducts} onReset={reloadProducts} />
      </Stack>
      <ProductList products={data.content} deleteProduct={deleteProduct} />
      <PaginationControl
        pageable={fromSpringPage(data)}
        onClick={loadProducts}
      />
    </Stack>
  );
}

function ProductList({ products, deleteProduct }) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Image</th>
          <th>Price</th>
          <th>Shop</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {products &&
          products.map((item) => (
            <tr key={item.id}>
              <td>
                <Link to={`/products/${item.id}`}>{item.name}</Link>
              </td>
              <td>
                {item.imageUrl && (
                  <Image
                    src={`/api/files/${item.imageUrl}`}
                    rounded
                    style={{ maxHeight: 96 }}
                  />
                )}
              </td>
              <td>{item.price}</td>
              <td>{item.shop.name}</td>
              <td className="text-end">
                <Button
                  variant="danger"
                  onClick={(evt) => deleteProduct(item.id)}
                >
                  Del
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}
