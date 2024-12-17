import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { JSX } from "react";

type ModalType = "Integration" | "Default";

type SimpleModalProps = {
  trigger: JSX.Element;
  children: React.ReactNode;
  title?: string;
  description?: string;
  type?: ModalType;
  logo?: string;
};

export const SimpleModal: React.FC<SimpleModalProps> = ({
  trigger,
  children,
  type = "Default",
  title = "",
  logo = "",
  description = "",
}) => {
  if (type === "Integration" && !logo) {
    console.error("Logo is required for Integration type");
    return null;
  }

  const renderIntegrationContent = () => (
    <>
      <div className="flex justify-center items-center gap-3">
        <div className="w-12 h-12 relative">
        </div>
        <div className="text-gray-400 flex space-x-2">
          <ArrowLeft size={20} />
          <ArrowRight size={20} />
        </div>
      </div>
      <DialogHeader className="flex flex-col items-center mt-4">
        <DialogTitle className="text-xl">{title || "jjj"}</DialogTitle>
        {description && (
          <DialogDescription className="text-center mt-2">{description}</DialogDescription>
        )}
      </DialogHeader>
      {children}
    </>
  );

  const renderDefaultContent = () => <>{children}</>;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogTitle className="text-xl">{title}</DialogTitle>
      <DialogDescription className="text-center mt-2">{description}</DialogDescription>
      <DialogContent
        className={`${
          type === "Integration"
            ? "bg-themeBlack border-themeDarkGray"
            : "bg-[#1C1C1E] !max-w-2xl border-themeGray"
        } p-6 rounded-md`}
      >
        {type === "Integration" ? renderIntegrationContent() : renderDefaultContent()}
      </DialogContent>
    </Dialog>
  );
};
