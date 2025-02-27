"use client";
import * as React from "react";
import { cn, validateEmail } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertDialogComponent } from "@/components/alertComponent";
import { AlertComponent } from "../../recovery/[accessToken]/components/alert";
import { createUser } from "@/api/user/service/main";

interface UserRegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserRegisterForm({
    className,
    ...props
}: UserRegisterFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [showAlert, setShowAlert] = React.useState<boolean>(false);
    const [showError, setShowError] = React.useState<boolean>(false);
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    const [apiMessageResponse, setApiMessageResponse] = React.useState<{
        title: string;
        description?: string;
    }>({ title: "", description: "" });

    const [name, setname] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);
        setShowError(false);

        createUser({ name: name, email, password })
            .then((response: any) => {
                setApiMessageResponse({
                    title: "Cadastro concluído com sucesso!",
                    description: "Você já pode interagir com a plataforma.",
                });
                setIsLoading(false);
                setShowAlert(true);
                router.refresh();
            })
            .catch((ex) => {
                setApiMessageResponse({
                    title: "Não conseguimos criar a sua conta. Provavelmente este email já está em uso. Tente novamente ou recupere a sua senha.",
                    description:
                        "Provavelmente este email já está em uso. Tente novamente ou recupere a sua senha.",
                });
                setIsLoading(false);
                setShowError(true);
            });
    }

    return (
        <div className={cn("grid", className)} {...props}>
            <AlertDialogComponent
                show={showAlert}
                title={apiMessageResponse?.title}
                description={apiMessageResponse?.description}
                cancelText={"Começar"}
                onCancel={() => {
                    router.push("/");
                }}
                isLoading={isLoading}
            />
            <form onSubmit={onSubmit}>
                <div className="grid gap-8">
                    {showError && (
                        <AlertComponent
                            helperText={apiMessageResponse?.title}
                        />
                    )}
                    <div className="grid gap-2">
                        <Label
                            className="text-purple-700 font-semibold text-[16px]"
                            htmlFor="name"
                        >
                            Nome
                        </Label>
                        <Input
                            id="name"
                            placeholder="Digite seu nome aqui"
                            type="text"
                            autoCapitalize="none"
                            autoComplete="name"
                            autoCorrect="off"
                            disabled={isLoading}
                            onChange={(e) => setname(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label
                            className="text-purple-700 font-semibold text-[16px]"
                            htmlFor="email"
                        >
                            E-mail
                        </Label>
                        <Input
                            id="email"
                            placeholder="Digite seu e-mail aqui"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            onChange={(e) =>
                                setEmail(e.target.value.toLowerCase())
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label
                            className="text-purple-700 font-semibold text-[16px]"
                            htmlFor="password"
                        >
                            Senha
                        </Label>
                        <Input
                            id="password"
                            placeholder="Crie uma senha e digite aqui"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            onChange={(e) => setPassword(e.target.value)}
                            helperText="A senha deve ter no mínimo 8 caracteres."
                            error={password.length > 0 && password.length < 8}
                            passwordIcon
                            showPassword={showPassword}
                            setShowPassword={() =>
                                setShowPassword(!showPassword)
                            }
                        />
                    </div>
                    <a className="text-grey-700 text-sm mt-4">
                        Ao cadastrar-se, você aceita nossos
                        <b className="text-purple-400 hover:cursor-pointer">
                            <a
                                href={"/service-terms"}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {" "}
                                Termos
                            </a>
                        </b>{" "}
                        e
                        <b className="text-purple-400">
                            <a
                                href={"/privacy-terms"}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {" "}
                                Políticas de privacidade
                            </a>
                        </b>
                        .
                    </a>
                    <Button
                        disabled={
                            isLoading ||
                            !validateEmail(email) ||
                            password === ""
                        }
                        isLoading={isLoading}
                        label="Entrar"
                    />
                </div>
            </form>
        </div>
    );
}
