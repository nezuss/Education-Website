import "./LoginPage.css";

import Layout from "../../components/layout/Layout";
import Card from "../../components/ui/Card/Card";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";

export default function LoginPage() {
    return (
        <Layout>
            <Card>
                <h1>Авторизація</h1>
                <p>Будь ласка, увійдіть до свого облікового запису</p>

                <form className="login-form">

                    <Input
                        type="email"
                        placeholder="Електронна пошта"
                    />

                    <Input
                        type="password"
                        placeholder="Пароль"
                    />

                    <Button type="submit">
                        Увійти
                    </Button>
                </form>
            </Card>
        </Layout>
    );
}