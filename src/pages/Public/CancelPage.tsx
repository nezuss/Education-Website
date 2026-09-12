import { Link } from "react-router-dom";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function CancelPage() {
    return (
        <>
            <PageHeader
                title="Оплату скасовано"
                description="Ви скасували процес оплати або сталася помилка транзакції."
            />

            <section className="form-panel">
                <Panel>
                    <h2>Платіж не було здійснено</h2>
                    <p style={{ margin: "12px 0" }}>
                        Кошти не були списані. Ви можете повернутися до каталогу курсів або спробувати повторити оплату пізніше.
                    </p>
                    <div className="actions" style={{ marginTop: "20px" }}>
                        <Link className="button-link" to="/courses">
                            До каталогу курсів
                        </Link>
                        <Link className="button-link" to="/student">
                            До кабінету студента
                        </Link>
                    </div>
                </Panel>
            </section>
        </>
    );
}
