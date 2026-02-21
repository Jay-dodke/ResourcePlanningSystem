import {useNavigate} from "react-router-dom";
import {useState} from "react";
import AllocationForm from "../components/AllocationForm";
import PageHeader from "../../../shared/ui/PageHeader";
import Button from "../../../shared/ui/Button";
import {createAllocation} from "../../allocations/allocations.service";
import {useUiStore} from "../../../store/useUiStore";
import Alert from "../../../shared/ui/Alert";
import {getErrorMessage} from "../../../shared/utils/errors";

const AllocationCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pushToast = useUiStore((state) => state.pushToast);

  const handleSubmit = async (payload) => {
    try {
      setError("");
      setLoading(true);
      await createAllocation(payload);
      pushToast({type: "success", message: "Allocation created"});
      navigate("/allocations");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create allocation"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Delivery"
        title="Assign employee"
        action={
          <Button variant="ghost" onClick={() => navigate("/allocations")}
          >
            Back to list
          </Button>
        }
      />
      <AllocationForm onSubmit={handleSubmit} loading={loading} />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default AllocationCreate;







