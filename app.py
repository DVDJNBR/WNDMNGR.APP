import streamlit as st
import pandas as pd
from database import execute_query, get_database_engine

# Configuration de la page
st.set_page_config(
    page_title="Wind Manager - Supabase",
    page_icon="🌬️",
    layout="wide"
)

st.title("WindManager (Supabase Only)")

# Sidebar Debug
with st.sidebar:
    st.header("État de la connexion")
    if st.button("Tester la connexion Supabase"):
        try:
            # Test simple
            res = execute_query("SELECT current_user, inet_server_addr();")
            if res:
                st.success(f"Connecté ! User: {res[0]['current_user']}")
            else:
                st.error("Connecté mais pas de résultat ?")
        except Exception as e:
            st.error(f"Erreur: {e}")

# Liste des tables (simplifiée pour l'exemple)
TABLES = [
    ("companies", "Entreprises"),
    ("farms", "Fermes"),
    ("persons", "Personnes"),
]

st.subheader("Données en direct")

for table_name, label in TABLES:
    with st.expander(f"Table: {label} ({table_name})"):
        # On essaie de lire les 5 premières lignes
        data = execute_query(f"SELECT * FROM {table_name} LIMIT 5")
        
        if data:
            st.dataframe(pd.DataFrame(data), use_container_width=True)
            st.caption(f"Aperçu des 5 premières lignes de {table_name}")
        else:
            st.warning(f"Aucune donnée ou erreur pour {table_name}")