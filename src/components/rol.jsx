import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { listRoles, createRol, updateRol, deleteRol } from "../services/rolService";

const styles = {
  // ... (styles sin cambios)
};

const Rol = ({ token: propToken }) => {
  const [roles, setRoles] = useState([]);
  const [newRol, setNewRol] = useState({ nombre_rol: "", descripcion: "" });
  const [editingRol, setEditingRol] = useState(null);
  const [deletingRol, setDeletingRol] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const token = propToken || localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Debes iniciar sesión para ver roles");
      return;
    }
    fetchRoles();
  }, [token]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listRoles(token);
      setRoles(data);
    } catch (err) {
      console.error("Error al obtener roles:", err);
      setError("No se pudieron cargar los roles");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRol = async () => {
    if (!newRol.nombre_rol.trim()) {
      setError("Debes ingresar un nombre para el rol");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await createRol({
        nombre_rol: newRol.nombre_rol.trim(),
        descripcion: newRol.descripcion.trim() || "Sin descripción",
      }, token);
      setRoles([...roles, data.rol || data]);
      setNewRol({ nombre_rol: "", descripcion: "" });
      setSuccess("✅ Rol creado exitosamente");
    } catch (err) {
      console.error("Error al crear rol:", err);
      setError(err.response?.data?.msg || "No se pudo crear el rol");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (rol) => {
    setEditingRol({ ...rol });
    setShowEditModal(true);
  };

  const handleUpdateRol = async () => {
    if (!editingRol.nombre_rol.trim()) {
      setError("El nombre del rol no puede estar vacío");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await updateRol(editingRol.id_rol, {
        nombre_rol: editingRol.nombre_rol.trim(),
        descripcion: editingRol.descripcion.trim() || "Sin descripción",
      }, token);
      setRoles(roles.map(r => r.id_rol === editingRol.id_rol ? editingRol : r));
      setShowEditModal(false);
      setEditingRol(null);
      setSuccess("✅ Rol actualizado exitosamente");
    } catch (err) {
      console.error("Error al actualizar rol:", err);
      setError(err.response?.data?.msg || "No se pudo actualizar el rol");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (rol) => {
    setDeletingRol(rol);
    setShowDeleteModal(true);
  };

  const handleDeleteRol = async () => {
    try {
      setLoading(true);
      setError("");
      await deleteRol(deletingRol.id_rol, token);
      setRoles(roles.filter(r => r.id_rol !== deletingRol.id_rol));
      setShowDeleteModal(false);
      setDeletingRol(null);
      setSuccess("✅ Rol eliminado exitosamente");
    } catch (err) {
      console.error("Error al eliminar rol:", err);
      setError(err.response?.data?.msg || "No se pudo eliminar el rol");
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreateRol();
    }
  };

  // ✅ Handlers de teclado para modales
  const handleModalKeyDown = (closeFn) => (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
      closeFn();
    }
  };

  if (!token) {
    return (
      <div style={styles.container}>
        <nav style={styles.nav}>
          <div style={styles.navContent}>
            <a href="/home" style={styles.logo}>URBAN CAPS</a>
            <a href="/login" style={styles.backBtn}>INICIAR SESIÓN</a>
          </div>
        </nav>
        <div style={{ ...styles.content, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "72px", marginBottom: "24px" }}>🔒</div>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "12px" }}>
              Acceso Restringido
            </h2>
            <p style={{ color: "#999999", marginBottom: "32px" }}>
              Debes iniciar sesión para acceder a esta sección
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .back-hover:hover { background: #1a1a1a !important; border-color: #333333 !important; }
        .button-hover:hover { background: #2563eb !important; transform: scale(1.02); }
        .button-success-hover:hover { background: #059669 !important; transform: scale(1.02); }
        .button-danger-hover:hover { background: #dc2626 !important; transform: scale(1.02); }
        .button-warning-hover:hover { background: #d97706 !important; transform: scale(1.02); }
        .input-focus:focus { border-color: #3b82f6 !important; }
        .role-hover:hover { border-color: #333333 !important; transform: translateY(-2px); }
        .icon-btn-hover:hover { background: #1a1a1a !important; border-color: #333333 !important; transform: scale(1.1); }
      `}</style>

      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <a href="/home" style={styles.logo}>URBAN CAPS</a>
          <a href="/home" style={styles.backBtn} className="back-hover">
            ← VOLVER AL INICIO
          </a>
        </div>
      </nav>

      <div style={styles.content}>
        <div style={styles.header}>
          {/* ✅ Fix: espaciado ambiguo corregido con {" "} */}
          <h1 style={styles.title}>
            <span>👥</span>{" "}GESTIÓN DE ROLES
          </h1>
          <p style={styles.subtitle}>
            Crea, edita y elimina roles del sistema
          </p>
        </div>

        <div style={styles.card}>
          {error && (
            <div style={{ ...styles.alert, ...styles.alertDanger }}>
              <span style={{ fontSize: "20px" }}>⚠️</span>
              <span style={{ color: "#ef4444", fontWeight: "600" }}>{error}</span>
            </div>
          )}
          {success && (
            <div style={{ ...styles.alert, ...styles.alertSuccess }}>
              <span style={{ fontSize: "20px" }}>✅</span>
              <span style={{ color: "#10b981", fontWeight: "600" }}>{success}</span>
            </div>
          )}

          <div style={{ marginBottom: "24px" }}>
            <div style={styles.formGroup}>
              <input
                type="text"
                id="nombre_rol"
                value={newRol.nombre_rol}
                onChange={(e) => setNewRol({ ...newRol, nombre_rol: e.target.value })}
                onKeyPress={handleKeyPress}
                placeholder="Nombre del nuevo rol..."
                style={styles.input}
                className="input-focus"
                disabled={loading}
              />
            </div>
            {/* ✅ Fix: label asociado al textarea con htmlFor */}
            <label htmlFor="descripcion_rol" style={{ display: "block", marginBottom: "8px", color: "#999999", fontSize: "14px" }}>
              Descripción
            </label>
            <textarea
              id="descripcion_rol"
              value={newRol.descripcion}
              onChange={(e) => setNewRol({ ...newRol, descripcion: e.target.value })}
              placeholder="Descripción del rol (opcional)..."
              style={styles.textarea}
              className="input-focus"
              disabled={loading}
            />
            <button
              onClick={handleCreateRol}
              disabled={loading}
              style={{ ...styles.button, marginTop: "12px", ...(loading ? styles.buttonDisabled : {}) }}
              className={!loading ? "button-hover" : ""}
            >
              {loading ? "⏳ CREANDO..." : "➕ CREAR ROL"}
            </button>
          </div>

          {loading && roles.length === 0 ? (
            <div style={styles.loader}>
              <div style={styles.spinner} />
              <p>Cargando roles...</p>
            </div>
          ) : roles.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📋</div>
              <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px", color: "#ffffff" }}>
                No hay roles registrados
              </h3>
              <p>Crea el primer rol para comenzar</p>
            </div>
          ) : (
            <div style={styles.rolesList}>
              {roles.map((rol, index) => (
                <div
                  key={rol.id_rol}
                  style={styles.roleItem}
                  className="role-hover"
                >
                  <div style={{
                    ...styles.roleIcon,
                    background: index === 0
                      ? "linear-gradient(135deg, #a855f7, #9333ea)"
                      : index === 1
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : "linear-gradient(135deg, #3b82f6, #2563eb)"
                  }}>
                    {index === 0 ? "👑" : index === 1 ? "🛡️" : "👤"}
                  </div>
                  <div style={styles.roleContent}>
                    <div style={styles.roleName}>{rol.nombre_rol}</div>
                    <div style={styles.roleDesc}>{rol.descripcion || "Sin descripción"}</div>
                  </div>
                  <div style={styles.roleActions}>
                    <button
                      onClick={() => handleEditClick(rol)}
                      style={styles.iconBtn}
                      className="icon-btn-hover"
                      title="Editar rol"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteClick(rol)}
                      style={styles.iconBtn}
                      className="icon-btn-hover"
                      title="Eliminar rol"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Modal de Edición - Fix: role, tabIndex, onKeyDown, aria */}
      {showEditModal && editingRol && (
        <div
          style={styles.modal}
          role="button"
          tabIndex={0}
          aria-label="Cerrar modal de edición"
          onClick={() => setShowEditModal(false)}
          onKeyDown={handleModalKeyDown(() => setShowEditModal(false))}
        >
          <div
            style={styles.modalContent}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              {/* ✅ Fix: espaciado ambiguo */}
              <span>✏️</span>{" "}
              <span id="edit-modal-title">EDITAR ROL</span>
            </div>

            <div style={{ marginBottom: "16px" }}>
              {/* ✅ Fix: label asociado con htmlFor */}
              <label htmlFor="edit_nombre_rol" style={{ display: "block", marginBottom: "8px", color: "#999999", fontSize: "14px" }}>
                Nombre del Rol
              </label>
              <input
                id="edit_nombre_rol"
                type="text"
                value={editingRol.nombre_rol}
                onChange={(e) => setEditingRol({ ...editingRol, nombre_rol: e.target.value })}
                style={styles.input}
                className="input-focus"
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              {/* ✅ Fix: label asociado con htmlFor */}
              <label htmlFor="edit_descripcion" style={{ display: "block", marginBottom: "8px", color: "#999999", fontSize: "14px" }}>
                Descripción
              </label>
              <textarea
                id="edit_descripcion"
                value={editingRol.descripcion}
                onChange={(e) => setEditingRol({ ...editingRol, descripcion: e.target.value })}
                style={styles.textarea}
                className="input-focus"
                disabled={loading}
              />
            </div>

            <div style={styles.modalButtons}>
              <button
                onClick={() => { setShowEditModal(false); setEditingRol(null); }}
                disabled={loading}
                style={{ ...styles.button, background: "#374151" }}
              >
                CANCELAR
              </button>
              <button
                onClick={handleUpdateRol}
                disabled={loading}
                style={{ ...styles.button, ...styles.buttonSuccess, ...(loading ? styles.buttonDisabled : {}) }}
                className={!loading ? "button-success-hover" : ""}
              >
                {loading ? "⏳ GUARDANDO..." : "💾 GUARDAR"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Modal de Eliminación - Fix: role, tabIndex, onKeyDown, aria */}
      {showDeleteModal && deletingRol && (
        <div
          style={styles.modal}
          role="button"
          tabIndex={0}
          aria-label="Cerrar modal de eliminación"
          onClick={() => setShowDeleteModal(false)}
          onKeyDown={handleModalKeyDown(() => setShowDeleteModal(false))}
        >
          <div
            style={styles.modalContent}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <span>⚠️</span>{" "}
              <span id="delete-modal-title">CONFIRMAR ELIMINACIÓN</span>
            </div>

            <p style={{ color: "#999999", marginBottom: "24px", lineHeight: "1.6" }}>
              ¿Estás seguro de que deseas eliminar el rol{" "}
              <strong style={{ color: "#ffffff" }}>"{deletingRol.nombre_rol}"</strong>?
              <br /><br />
              Esta acción no se puede deshacer.
            </p>

            <div style={styles.modalButtons}>
              <button
                onClick={() => { setShowDeleteModal(false); setDeletingRol(null); }}
                disabled={loading}
                style={{ ...styles.button, background: "#374151" }}
              >
                CANCELAR
              </button>
              <button
                onClick={handleDeleteRol}
                disabled={loading}
                style={{ ...styles.button, ...styles.buttonDanger, ...(loading ? styles.buttonDisabled : {}) }}
                className={!loading ? "button-danger-hover" : ""}
              >
                {loading ? "⏳ ELIMINANDO..." : "🗑️ ELIMINAR"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Fix: token declarado en propTypes
Rol.propTypes = {
  token: PropTypes.string.isRequired,
};

Rol.defaultProps = {
  token: "",
};

export default Rol;