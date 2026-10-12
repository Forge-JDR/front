import React from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../design-system";
import "./cgu.css";
export default function CGU() {
  const { t } = useTranslation();
  return (
    <div className="legal-page">
      <PageHeader eyebrow="À PROPOS DE VOTRE ATELIER" title={t("TCU.title")} />
      <article className="ui-card legal-content">
        <p className="legal-date">{t("TCU.date")}</p>
        <p>{t("TCU.pitch")}</p>
        {Array.from({ length: 12 }, (_, i) => (
          <section key={i}>
            <h2>{t(`TCU.title${i + 1}`)}</h2>
            <p>{t(`TCU.texte${i + 1}`)}</p>
          </section>
        ))}
      </article>
    </div>
  );
}
