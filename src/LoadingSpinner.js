import { Spinner } from "react-bootstrap";
import { useNavigation } from "react-router-dom";

export default function LoadingSpinner() {
  const navigation = useNavigation();
  return (
    navigation.state === "loading" && (
      <Spinner
        as="span"
        animation="grow"
        size="sm"
        role="status"
        aria-hidden="true"
      />
    )
  );
}
