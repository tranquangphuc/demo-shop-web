import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Stack, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useLoaderData } from "react-router-dom";
import { PaginationControl, fromSpringPage } from "../ui/PaginationControl";

export default function ShopMasterPage() {
  const deleteShop = (id) => {
    console.debug("delete shop", id);
    axios.delete(`/api/shops/${id}`).then((res) => setUpdateTime(Date.now()));
  };
  const [updateTime, setUpdateTime] = useState(Date.now());
  const [data, setData] = useState(useLoaderData());

  const loadShops = (page) => {
    if (page) {
      axios.get(`/api/shops?page=${page}`).then((res) => setData(res.data));
    } else {
      axios.get(`/api/shops`).then((res) => setData(res.data));
    }
  };

  useEffect(() => loadShops(), [updateTime]);

  return (
    <Stack>
      <Stack direction="horizontal">
        <LinkContainer to="/shops/new">
          <Button variant="primary">Create New Shop</Button>
        </LinkContainer>
      </Stack>
      <ShopList shops={data.content} deleteShop={deleteShop} />
      <PaginationControl pageable={fromSpringPage(data)} onClick={loadShops} />
    </Stack>
  );
}

function ShopList({ shops, deleteShop }) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {shops &&
          shops.map((shop) => (
            <tr key={shop.id}>
              <td>
                <Link to={`/shops/${shop.id}`}>{shop.name}</Link>
              </td>
              <td>{shop.address}</td>
              <td className="text-end">
                <Button variant="danger" onClick={() => deleteShop(shop.id)}>
                  Del
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}
