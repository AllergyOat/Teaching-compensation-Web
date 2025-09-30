import { Button } from "../ui/button";
import { RotateCw } from "lucide-react";


const Buttons = ({ text, isPending, className }: { text: string; isPending: boolean; className?: string }) => {
  return (
    <Button disabled={isPending} className={`${className}`}>
      {isPending ? (
        <>
          <RotateCw className="animate-spin" />
          <span>Please wait...</span>
        </>
      ) : (
        <p>{text}</p>
      )}
    </Button>
  );
};
export default Buttons;