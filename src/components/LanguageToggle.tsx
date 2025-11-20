import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "hi" : "en")}
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      {language === "en" ? "EN" : "हि"}
    </Button>
  );
};
