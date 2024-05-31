import { Toaster, toast } from "sonner";
import "@/styles/sonner.css";

export function Toast(props: any) {
  setTimeout(() => {
    if (props.error === "true") {
      toast.error(props.message, {
        duration: 1500,
      });
    } else {
      toast.success(props.message, {
        duration: 1500,
      });
    }
  });
  return (
    <Toaster
      theme={props.theme}
      position={props.direction}
      expand={true}
      richColors
    />
  );
}
