import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    city: "",
    municipalityType: "" as "Municipal Corporation" | "Municipal Council" | "Nagar Panchayat" | "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.password || !formData.city || !formData.municipalityType) {
      toast.error("Please fill all fields");
      return;
    }

    login({
      id: `AUTH-${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      municipalityType: formData.municipalityType as "Municipal Corporation" | "Municipal Council" | "Nagar Panchayat",
    });

    toast.success(`Welcome ${formData.name}!`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/5 p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="absolute top-6 right-6 z-10">
        <LanguageToggle />
      </div>
      
      <Card className="w-full max-w-lg shadow-2xl border-0 backdrop-blur-sm bg-card/95 relative z-10">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t("welcomeBack")}
          </CardTitle>
          <CardDescription className="text-base">{t("loginDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">{t("fullName")}</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">{t("phoneNumber")}</Label>
                <Input
                  id="phone"
                  placeholder="+91-XXXXX-XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@gov.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">{t("cityLocation")}</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, city: value })}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select City/Municipality" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="Ranchi">Ranchi</SelectItem>
                  <SelectItem value="Jamshedpur">Jamshedpur</SelectItem>
                  <SelectItem value="Dhanbad">Dhanbad</SelectItem>
                  <SelectItem value="Bokaro Steel City">Bokaro Steel City</SelectItem>
                  <SelectItem value="Deoghar">Deoghar</SelectItem>
                  <SelectItem value="Phusro">Phusro</SelectItem>
                  <SelectItem value="Hazaribagh">Hazaribagh</SelectItem>
                  <SelectItem value="Giridih">Giridih</SelectItem>
                  <SelectItem value="Ramgarh">Ramgarh</SelectItem>
                  <SelectItem value="Medininagar">Medininagar (Daltonganj)</SelectItem>
                  <SelectItem value="Chirkunda">Chirkunda</SelectItem>
                  <SelectItem value="Chaibasa">Chaibasa</SelectItem>
                  <SelectItem value="Gumla">Gumla</SelectItem>
                  <SelectItem value="Dumka">Dumka</SelectItem>
                  <SelectItem value="Sahibganj">Sahibganj</SelectItem>
                  <SelectItem value="Madhupur">Madhupur</SelectItem>
                  <SelectItem value="Chatra">Chatra</SelectItem>
                  <SelectItem value="Garhwa">Garhwa</SelectItem>
                  <SelectItem value="Lohardaga">Lohardaga</SelectItem>
                  <SelectItem value="Simdega">Simdega</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="municipalityType" className="text-sm font-medium">Municipality Type</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, municipalityType: value as any })}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select Municipality Type" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="Municipal Corporation">Municipal Corporation</SelectItem>
                  <SelectItem value="Municipal Council">Municipal Council</SelectItem>
                  <SelectItem value="Nagar Panchayat">Nagar Panchayat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-11"
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
              {t("loginButton")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
