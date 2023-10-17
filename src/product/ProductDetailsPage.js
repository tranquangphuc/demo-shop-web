import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Stack } from "react-bootstrap";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { ProductForm } from "./ProductForm";

const axiosCustom = axios.create({ formSerializer: { dots: true } });

export default function ProductDetailsPage() {
  const [data, setData] = useState(useLoaderData());
  let { shopId } = useParams();
  if (shopId) {
    setData({ ...data, ...{ shop: { id: shopId } } });
  }
  const navigate = useNavigate();
  console.log(data);
  const saveProduct = async (formData) => {
    let url;
    if (formData.id) {
      console.debug("update product", formData);
      url = `/api/products/${formData.id}`;
    } else {
      console.debug("create product", formData);
      url = `/api/products`;
    }
    await axiosCustom
      .postForm(url, formData)
      .then(() => navigate(-1))
      .catch((error) => {
        let message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error.message ||
          error.code;
        setError({ message });
      });
  };
  const [shops, setShops] = useState();
  useEffect(() => {
    fetch(`/api/shops`)
      .then((res) => res.json())
      .then((json) => setShops(json));
  }, []);
  const [error, setError] = useState();
  return (
    <Stack gap={3}>
      <ProductForm data={data} shops={shops?.content} onSubmit={saveProduct} />
      {error && <Alert variant="danger">{error.message}</Alert>}
    </Stack>
  );
}
