import streamlit as st
import pandas as pd
from database import execute_query, init_supabase_connection

# Configuration de la page
st.set_page_config(
    page_title="Wind Manager - Database",
    page_icon="",
    layout="wide"
)

st.title("Windmanager - Connexion Base de Données")
st.caption("Utilisation du client Supabase via API REST")

# Sidebar Debug
with st.sidebar:
    st.header("État de la connexion")
    if st.button("Tester la connexion"):
        try:
            client = init_supabase_connection()
            st.success("Client Supabase connecté")
        except Exception as e:
            st.error(f"Erreur: {e}")

# Liste des tables
TABLES = [("companies", "Entreprises")]

for table_name, label in TABLES:
    st.subheader(f"Table: {label} ({table_name})")
    data = execute_query(table=table_name, columns="*")
    if data:
        st.success(f"{len(data)} enregistrement(s) trouvé(s)")
        df = pd.DataFrame(data)
        st.dataframe(df, use_container_width=True)
    else:
        st.warning(f"Aucune donnée dans la table {table_name}")
