import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Stack, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useLoaderData } from "react-router-dom";
import { PaginationControl, fromSpringPage } from "../ui/PaginationControl";

export default function CustomerMasterPage() {
  const deleteCustomer = (id) => {
    console.debug("delete customer", id);
    axios.delete(`/api/customers/${id}`).then((res) => loadCustomers());
  };
  const [data, setData] = useState(useLoaderData());
  const [updateTime, setUpdateTime] = useState(Date.now());

  const loadCustomers = (page) => {
    fetchCustomers(page).then((res) => setData(res.data));
  };

  useEffect(() => loadCustomers(), [updateTime]);

  return (
    <Stack>
      <Stack direction="horizontal">
        <LinkContainer to="/customers/new">
          <Button variant="primary">Create New Customer</Button>
        </LinkContainer>
      </Stack>
      <CustomerList customers={data.content} deleteCustomer={deleteCustomer} />
      <PaginationControl
        pageable={fromSpringPage(data)}
        onClick={loadCustomers}
      />
    </Stack>
  );
}

function CustomerList({ customers, deleteCustomer }) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Birthday</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {customers &&
          customers.map((cus) => (
            <tr key={cus.id}>
              <td>
                <Link to={`/customers/${cus.id}`}>{cus.name}</Link>
              </td>
              <td>{cus.email}</td>
              <td>{cus.birthday}</td>
              <td className="text-end">
                <Button
                  variant="danger"
                  onClick={(evt) => deleteCustomer(cus.id)}
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

export function fetchCustomers(page) {
  if (page) {
    return axios.get(`/api/customers?page=${page}`);
  } else {
    return axios.get(`/api/customers`);
  }
}
