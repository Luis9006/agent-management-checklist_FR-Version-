import { useState } from "react";

// ── Données ───────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: "metriques",
    label: "Indicateurs de performance",
    icon: "📊",
    color: "#FF7A59",
    description: "Taux de résolution et satisfaction client lus ensemble.",
    items: [
      {
        id: "m1",
        text: "Avez-vous examiné le taux de résolution de l'agent au cours de la période concernée ?",
        detail: "Référence : les équipes leaders atteignent entre 80 et 90 % (Freshworks CX Benchmark 2025).",
      },
      {
        id: "m2",
        text: "Avez-vous examiné le CSAT de l'agent au cours de la même période ?",
        detail: "Moyenne du secteur : 75–85 %. Les meilleures équipes s'approchent des 90 %.",
      },
      {
        id: "m3",
        text: "Les deux indicateurs évoluent-ils dans la même direction ?",
        detail: "Si le taux de résolution augmente et que le CSAT baisse, l'agent clôture des conversations sans les résoudre correctement.",
      },
      {
        id: "m4",
        text: "Le volume de tickets traités par l'agent a-t-il évolué par rapport à la période précédente ?",
        detail: "Un changement significatif peut indiquer une dérive dans le périmètre de l'agent.",
      },
      {
        id: "m5",
        text: "Existe-t-il une ligne de base documentée à laquelle comparer ces indicateurs ?",
        detail: "Sans référence de départ, les métriques actuelles n'ont pas de contexte d'amélioration.",
      },
    ],
  },
  {
    id: "lacunes",
    label: "Lacunes de connaissance",
    icon: "🔍",
    color: "#00BDA5",
    description: "Identifier ce que l'agent transfère par manque d'information, et non par complexité.",
    items: [
      {
        id: "v1",
        text: "Avez-vous analysé les conversations où l'agent a transféré à un humain ?",
        detail: "Distinguez : le transfert était-il dû à la complexité, ou à un manque d'information ?",
      },
      {
        id: "v2",
        text: "Avez-vous identifié les thèmes récurrents dans ces transferts ?",
        detail: "Les lacunes qui apparaissent plus d'une fois sont des candidats immédiats à une mise à jour.",
      },
      {
        id: "v3",
        text: "Existe-t-il un processus pour transformer les lacunes identifiées en mises à jour d'entraînement ?",
        detail: "Des lacunes sans processus de résolution s'accumulent et dégradent progressivement les performances.",
      },
      {
        id: "v4",
        text: "La base de connaissances de l'agent reflète-t-elle les récents changements de produits, de tarifs ou de politiques ?",
        detail: "Un contenu obsolète génère des réponses incorrectes, même si l'agent fonctionne bien par ailleurs.",
      },
      {
        id: "v5",
        text: "Avez-vous vérifié que les sources d'entraînement sont lisibles par l'agent ?",
        detail: "Les pages avec du JavaScript lourd ou des PDF non structurés peuvent ne pas être interprétées correctement.",
      },
    ],
  },
  {
    id: "autonomie",
    label: "Niveaux d'autonomie",
    icon: "⚖️",
    color: "#516F90",
    description: "L'autonomie ne s'octroie pas : elle se construit avec des preuves.",
    items: [
      {
        id: "a1",
        text: "Avez-vous défini quels types de demandes l'agent peut traiter de façon autonome ?",
        detail: "Critère suggéré : information publique + flux prévisible = autonomie accordée.",
      },
      {
        id: "a2",
        text: "Avez-vous défini les critères de transfert vers un humain ?",
        detail: "Exemples : information sensible, signaux de frustration du client, plus de 3 échanges sans résolution.",
      },
      {
        id: "a3",
        text: "Les limites d'autonomie ont-elles été révisées depuis la dernière période ?",
        detail: "Les limites efficaces au lancement peuvent ne plus être adaptées plusieurs mois après.",
      },
      {
        id: "a4",
        text: "Les utilisateurs ont-ils une visibilité sur ce que fait l'agent ?",
        detail: "La transparence génère de la confiance. Plus la confiance s'accumule, plus l'autonomie devient durable.",
      },
      {
        id: "a5",
        text: "Des mots-clés ou des thèmes déclencheurs de transfert immédiat sont-ils configurés ?",
        detail: "Exemples : 'je veux annuler', 'je suis très mécontent', sujets hors du périmètre de l'agent.",
      },
    ],
  },
  {
    id: "cycle",
    label: "Cycle d'amélioration",
    icon: "🔄",
    color: "#7C4DFF",
    description: "Observer sans agir n'est pas de la gestion. C'est de la surveillance passive.",
    items: [
      {
        id: "c1",
        text: "Les conclusions de cet audit sont-elles consignées dans un document dédié ?",
        detail: "Sans trace écrite, les tendances restent invisibles. Le cycle d'amélioration requiert une mémoire institutionnelle.",
      },
      {
        id: "c2",
        text: "Des changements concrets ont-ils été mis en œuvre depuis le dernier audit ?",
        detail: "Si la réponse est non, le processus d'audit ne ferme pas la boucle d'amélioration.",
      },
      {
        id: "c3",
        text: "Une personne ou une équipe est-elle désignée pour agir sur les conclusions ?",
        detail: "Sans responsable clairement défini, les enseignements restent dans le rapport et ne génèrent aucune amélioration.",
      },
      {
        id: "c4",
        text: "La fréquence d'audit est-elle définie en fonction du stade de maturité de l'agent ?",
        detail: "Agent récent : supervision fréquente. Agent mature avec un solide historique : révision périodique.",
      },
      {
        id: "c5",
        text: "Avez-vous vérifié que les changements appliqués ont produit l'amélioration attendue ?",
        detail: "Un ajustement sans vérification brise la boucle. L'amélioration exige une confirmation, pas seulement une action.",
      },
    ],
  },
];

const STATUS = {
  pending: { label: "Non évalué", color: "#CBD6E2", bg: "#F5F8FA" },
  yes: { label: "Oui", color: "#00BDA5", bg: "#E5F8F6" },
  no: { label: "Non", color: "#FF7A59", bg: "#FFF3F0" },
  na: { label: "N/A", color: "#7C98B6", bg: "#EAF0F6" },
};

// ── Composants ─────────────────────────────────────────────────────────────────

function ScoreRing({ pct, color }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#E5E5E5" strokeWidth="7" />
      <circle
        cx="36" cy="36" r={r}
        fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dasharray 0.5s ease" }}
      />
      <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2D3E50">
        {pct}%
      </text>
    </svg>
  );
}

function CheckItem({ item, status, onToggle }) {
  const [open, setOpen] = useState(false);
  const s = STATUS[status];

  return (
    <div style={{
      background: s.bg,
      border: `1.5px solid ${status === "pending" ? "#DDE3EC" : s.color}`,
      borderRadius: "10px",
      marginBottom: "10px",
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      <div
        style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 16px", cursor: "pointer" }}
        onClick={() => setOpen((o) => !o)}
      >
        <div
          style={{ display: "flex", gap: "6px", flexShrink: 0, marginTop: "2px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {["yes", "no", "na"].map((v) => (
            <button
              key={v}
              onClick={() => onToggle(v)}
              title={STATUS[v].label}
              style={{
                width: "28px", height: "28px", borderRadius: "6px",
                border: `2px solid ${status === v ? STATUS[v].color : "#CBD6E2"}`,
                background: status === v ? STATUS[v].color : "white",
                color: status === v ? "white" : "#7C98B6",
                fontWeight: "700", fontSize: "10px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
              }}
            >
              {v === "yes" ? "O" : v === "no" ? "N" : "—"}
            </button>
          ))}
        </div>
        <p style={{
          margin: 0, fontSize: "14px", color: "#2D3E50", lineHeight: "1.5",
          flex: 1, fontWeight: status === "pending" ? "400" : "500",
        }}>
          {item.text}
        </p>
        <span style={{ fontSize: "12px", color: "#7C98B6", flexShrink: 0, marginTop: "4px" }}>
          {open ? "▲" : "▼"}
        </span>
      </div>

      {open && (
        <div style={{
          padding: "0 16px 14px 58px", fontSize: "13px", color: "#516F90",
          lineHeight: "1.6", borderTop: `1px solid ${s.color}22`,
        }}>
          💡 {item.detail}
        </div>
      )}
    </div>
  );
}

function SectionCard({ section, statuses, onToggle }) {
  const answered = section.items.filter((i) => statuses[i.id] !== "pending").length;
  const yesCount = section.items.filter((i) => statuses[i.id] === "yes").length;
  const pct = Math.round((yesCount / section.items.length) * 100);
  const progress = Math.round((answered / section.items.length) * 100);
  const [open, setOpen] = useState(true);

  return (
    <div style={{
      background: "white", borderRadius: "14px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      marginBottom: "20px", overflow: "hidden", border: "1px solid #EAF0F6",
    }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: "14px",
          padding: "18px 20px", cursor: "pointer",
          borderLeft: `5px solid ${section.color}`,
          background: open ? "white" : "#FAFBFC",
        }}
      >
        <span style={{ fontSize: "22px" }}>{section.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "700", fontSize: "16px", color: "#2D3E50" }}>{section.label}</div>
          <div style={{ fontSize: "12px", color: "#7C98B6", marginTop: "2px" }}>{section.description}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ textAlign: "center" }}>
            <ScoreRing pct={pct} color={section.color} />
            <div style={{ fontSize: "10px", color: "#7C98B6", marginTop: "2px" }}>conformité</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", color: "#7C98B6" }}>{answered}/{section.items.length} évalués</div>
            <div style={{ width: "80px", height: "6px", background: "#EAF0F6", borderRadius: "3px", marginTop: "6px", overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: section.color, borderRadius: "3px", transition: "width 0.3s ease" }} />
            </div>
          </div>
          <span style={{ color: "#CBD6E2", fontSize: "16px" }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div style={{ padding: "16px 20px 20px" }}>
          {section.items.map((item) => (
            <CheckItem
              key={item.id}
              item={item}
              status={statuses[item.id] || "pending"}
              onToggle={(val) => onToggle(item.id, val)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Application principale ─────────────────────────────────────────────────────

export default function App() {
  const initialState = {};
  SECTIONS.forEach((s) => s.items.forEach((i) => (initialState[i.id] = "pending")));
  const [statuses, setStatuses] = useState(initialState);
  const [agentName, setAgentName] = useState("");
  const [period, setPeriod] = useState("");
  const [exported, setExported] = useState(false);

  const handleToggle = (id, val) => {
    setStatuses((prev) => ({ ...prev, [id]: prev[id] === val ? "pending" : val }));
  };

  const handleReset = () => {
    const fresh = {};
    SECTIONS.forEach((s) => s.items.forEach((i) => (fresh[i.id] = "pending")));
    setStatuses(fresh);
    setExported(false);
  };

  const allItems = SECTIONS.flatMap((s) => s.items);
  const totalAnswered = allItems.filter((i) => statuses[i.id] !== "pending").length;
  const totalYes = allItems.filter((i) => statuses[i.id] === "yes").length;
  const totalNo = allItems.filter((i) => statuses[i.id] === "no").length;
  const globalPct = Math.round((totalYes / allItems.length) * 100);
  const completionPct = Math.round((totalAnswered / allItems.length) * 100);

  const riskLevel =
    globalPct >= 80 ? { label: "Risque faible", color: "#00BDA5", icon: "✅" }
    : globalPct >= 50 ? { label: "Risque modéré", color: "#F5C26B", icon: "⚠️" }
    : { label: "Risque élevé", color: "#FF7A59", icon: "🔴" };

  const handleExport = () => {
    const lines = [
      `AUDIT DE PERFORMANCE D'AGENT IA`,
      `Agent : ${agentName || "(non renseigné)"}`,
      `Période : ${period || "(non renseignée)"}`,
      `Date : ${new Date().toLocaleDateString("fr-FR")}`,
      ``,
      `RÉSUMÉ`,
      `Conformité globale : ${globalPct}%`,
      `Niveau de risque : ${riskLevel.label}`,
      `Éléments évalués : ${totalAnswered}/${allItems.length}`,
      `Réponses Oui : ${totalYes} | Non : ${totalNo}`,
      ``,
    ];

    SECTIONS.forEach((sec) => {
      lines.push(`── ${sec.label.toUpperCase()} ──`);
      sec.items.forEach((item) => {
        const s = statuses[item.id];
        const label = s === "yes" ? "OUI" : s === "no" ? "NON" : s === "na" ? "N/A" : "NON ÉVALUÉ";
        lines.push(`[${label}] ${item.text}`);
      });
      lines.push("");
    });

    lines.push(`Généré avec Audit des Agents IA · HubSpot Academy`);

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-agent-${agentName || "sans-nom"}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F8FA", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>

      {/* En-tête */}
      <div style={{ background: "linear-gradient(135deg, #2D3E50 0%, #1A252F 100%)", padding: "32px 24px 28px", color: "white" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", color: "#FF7A59", textTransform: "uppercase" }}>
              HubSpot Academy
            </span>
            <span style={{ color: "#516F90", fontSize: "11px" }}>·</span>
            <span style={{ fontSize: "11px", color: "#7C98B6", letterSpacing: "0.5px" }}>
              Former et gérer les agents IA
            </span>
          </div>
          <h1 style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: "800", letterSpacing: "-0.3px" }}>
            Audit périodique de performance
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#B0C3D4", lineHeight: "1.6" }}>
            Supervisez les performances de votre agent avec des données concrètes. Chaque élément
            non évalué est un risque non géré.
          </p>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
            <input
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Nom de l'agent"
              style={{
                background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)",
                borderRadius: "8px", padding: "8px 14px", color: "white",
                fontSize: "13px", outline: "none", width: "200px",
              }}
            />
            <input
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="Période (ex. juin–juil. 2026)"
              style={{
                background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)",
                borderRadius: "8px", padding: "8px 14px", color: "white",
                fontSize: "13px", outline: "none", width: "220px",
              }}
            />
          </div>
        </div>
      </div>

      {/* Barre de résumé */}
      <div style={{
        background: "white", borderBottom: "1px solid #EAF0F6",
        padding: "16px 24px", position: "sticky", top: 0, zIndex: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}>
        <div style={{ maxWidth: "780px", margin: "0 auto", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ScoreRing pct={globalPct} color={riskLevel.color} />
            <div>
              <div style={{ fontWeight: "700", fontSize: "14px", color: "#2D3E50" }}>
                {riskLevel.icon} {riskLevel.label}
              </div>
              <div style={{ fontSize: "12px", color: "#7C98B6" }}>
                {totalAnswered}/{allItems.length} éléments évalués
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", flex: 1 }}>
            {[
              { label: "Oui", val: totalYes, color: "#00BDA5" },
              { label: "Non", val: totalNo, color: "#FF7A59" },
              { label: "En attente", val: allItems.length - totalAnswered, color: "#CBD6E2" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontWeight: "800", fontSize: "20px", color: s.color }}>{s.val}</div>
                <div style={{ fontSize: "11px", color: "#7C98B6" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleReset}
              style={{
                padding: "8px 16px", borderRadius: "8px", border: "1.5px solid #CBD6E2",
                background: "white", color: "#516F90", fontSize: "12px", fontWeight: "600", cursor: "pointer",
              }}
            >
              Réinitialiser
            </button>
            <button
              onClick={handleExport}
              style={{
                padding: "8px 16px", borderRadius: "8px", border: "none",
                background: "#FF7A59", color: "white", fontSize: "12px", fontWeight: "700",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
              }}
            >
              {exported ? "✓ Téléchargé" : "↓ Exporter le rapport"}
            </button>
          </div>
        </div>

        <div style={{ maxWidth: "780px", margin: "12px auto 0" }}>
          <div style={{ height: "4px", background: "#EAF0F6", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{
              width: `${completionPct}%`, height: "100%",
              background: "linear-gradient(90deg, #FF7A59, #7C4DFF)",
              borderRadius: "2px", transition: "width 0.4s ease",
            }} />
          </div>
          <div style={{ fontSize: "11px", color: "#7C98B6", marginTop: "4px", textAlign: "right" }}>
            {completionPct}% complété
          </div>
        </div>
      </div>

      {/* Légende */}
      <div style={{ maxWidth: "780px", margin: "16px auto 0", padding: "0 24px" }}>
        <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#7C98B6", flexWrap: "wrap" }}>
          <span>Instructions : pour chaque élément, sélectionnez</span>
          {[
            { key: "yes", label: "O = Oui", color: "#00BDA5" },
            { key: "no", label: "N = Non", color: "#FF7A59" },
            { key: "na", label: "— = Non applicable", color: "#7C98B6" },
          ].map((b) => (
            <span key={b.key} style={{ color: b.color, fontWeight: "600" }}>{b.label}</span>
          ))}
          <span>· Cliquez sur un élément pour afficher le détail.</span>
        </div>
      </div>

      {/* Sections */}
      <div style={{ maxWidth: "780px", margin: "16px auto 0", padding: "0 24px 48px" }}>
        {SECTIONS.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            statuses={statuses}
            onToggle={handleToggle}
          />
        ))}

        {/* Note de bas de page */}
        <div style={{
          background: "#2D3E50", borderRadius: "12px", padding: "18px 22px",
          color: "#B0C3D4", fontSize: "13px", lineHeight: "1.7",
        }}>
          <span style={{ color: "#FF7A59", fontWeight: "700" }}>À retenir : </span>
          Activer un agent n'est pas une finalité — c'est le début d'une nouvelle responsabilité.
          Cet audit ne mesure pas si l'agent est bon. Il mesure si l'équipe gère bien l'agent.
        </div>
      </div>
    </div>
  );
}
