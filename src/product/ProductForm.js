import { useState } from "react";
import { Card, InputGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";

export function ProductForm({ data, shops, onSubmit }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: data?.id,
      name: data?.name,
      imageUrl: data?.imageUrl,
      price: data?.price,
      shop: {
        id: data?.shop?.id,
      },
    },
  });

  const [imageUrl, setImageUrl] = useState(
    data?.imageUrl && `/api/files/${data.imageUrl}`,
  );

  const previewImage = (event) => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    let file = event.target.files[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const resetImage = () => {
    setImageUrl(data?.imageUrl && `/api/files/${data.imageUrl}`);
    setValue("imageUrl", data?.imageUrl);
    setValue("imageFile", null);
  };

  const removeImage = () => {
    setImageUrl(null);
    setValue("imageUrl", null);
    setValue("imageFile", null);
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("id")} />
      <input type="hidden" {...register("imageUrl")} />
      <Form.Group className="mb-3">
        <Form.Label>Shop</Form.Label>
        {shops && (
          <Form.Select {...register("shop.id")}>
            {shops.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </Form.Select>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Name"
          {...register("name", { required: "Product's name is required" })}
          isInvalid={errors.name}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicBirthday">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          min={0}
          step={0.01}
          placeholder="Price"
          {...register("price", { required: "Product's price is required" })}
          isInvalid={errors.price}
        />
        <Form.Control.Feedback type="invalid">
          {errors.price?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="imageFile">
        <Form.Label>Image</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            type="file"
            accept="image/*"
            {...register("imageFile")}
            onChange={previewImage}
          />
          <Button variant="light" onClick={resetImage}>
            Reset
          </Button>
          <Button variant="warning" onClick={removeImage}>
            Remove
          </Button>
        </InputGroup>
        {imageUrl && (
          <Card className="mt-3" style={{ maxWidth: 400 }}>
            <Card.Img variant="top" src={imageUrl} />
          </Card>
        )}
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
