import { Stack } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";

export default function ProductSearchForm({ onSubmit, onReset }) {
  const { register, handleSubmit, reset } = useForm();
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="horizontal" gap={3}>
        <Button
          variant="outline-danger"
          onClick={() => {
            reset();
            onReset();
          }}
        >
          Reset
        </Button>
        <Form.Control
          id="productNameInput"
          placeholder="Product Name"
          {...register("name")}
        />
        <Form.Control
          type="number"
          id="productMinPriceInput"
          placeholder="Product Min Price"
          min={0}
          step={0.01}
          {...register("minPrice")}
        />
        <Form.Control
          type="number"
          id="productMaxPriceInput"
          placeholder="Product Max Price"
          step={0.01}
          {...register("maxPrice")}
        />
        <Form.Label htmlFor="shopNameInput" visuallyHidden>
          Shop Name
        </Form.Label>
        {/* <Form.Control
                id="shopNameInput"
                placeholder="Shop Name"
                {...register("shopName")}
            /> */}
        <Button type="submit">Search</Button>
      </Stack>
    </Form>
  );
}
