import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowUpRight,
  ChevronDown,
  BookOpen,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react";
import { fetchCurrentUser, logout } from "../../store/slices/auth.slice";
import { Brand, Button } from "../design-system";

export default function Layout() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const sidebarRef = useRef();
  const connected =
    auth.isLoggedIn && !["/login", "/signup"].includes(location.pathname);
  useEffect(() => {
    if (auth.isLoggedIn && !auth.user && !profileError)
      dispatch(fetchCurrentUser())
        .unwrap()
        .catch(() => setProfileError(true));
  }, [auth.isLoggedIn, auth.user, dispatch, profileError]);
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.activeElement;
    const nodes = [
      ...sidebarRef.current.querySelectorAll("a, button:not(:disabled)"),
    ];
    nodes[0]?.focus();
    const keydown = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
      if (event.key === "Tab" && nodes.length) {
        if (event.shiftKey && document.activeElement === nodes[0]) {
          event.preventDefault();
          nodes[nodes.length - 1].focus();
        }
        if (
          !event.shiftKey &&
          document.activeElement === nodes[nodes.length - 1]
        ) {
          event.preventDefault();
          nodes[0].focus();
        }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      previous?.focus();
    };
  }, [mobileOpen]);
  const links = [
    {
      to: "/atelier",
      label: "Vue d’ensemble",
      icon: LayoutDashboard,
      view: null,
    },
    {
      to: "/atelier?view=rpgs",
      label: "Mes JDR",
      icon: BookOpen,
      view: "rpgs",
    },
    {
      to: "/atelier?view=campaigns",
      label: "Mes parties",
      icon: Compass,
      view: "campaigns",
    },
    {
      to: "/atelier?view=characters",
      label: "Personnages",
      icon: Users,
      view: "characters",
    },
  ];
  const selected = new URLSearchParams(location.search).get("view");
  const signOut = async () => {
    await dispatch(logout());
    navigate("/login");
  };
  const core = [
    "/",
    "/atelier",
    "/user",
    "/login",
    "/signup",
    "/contact",
    "/cgu",
  ].includes(location.pathname);
  return (
    <div className={`site-layout ${connected ? "site-layout--connected" : ""}`}>
      <a className="skip-link" href="#page-content">
        Aller au contenu
      </a>
      {connected ? (
        <>
          <div className="mobile-bar">
            <Brand />
            <Button
              variant="ghost"
              icon={mobileOpen ? X : Menu}
              aria-label={
                mobileOpen ? "Fermer la navigation" : "Ouvrir la navigation"
              }
              aria-expanded={mobileOpen}
              aria-controls="navigation-atelier"
              onClick={() => setMobileOpen(!mobileOpen)}
            />
          </div>
          {mobileOpen && (
            <button
              className="nav-scrim"
              aria-label="Fermer la navigation"
              onClick={() => setMobileOpen(false)}
            />
          )}
          <aside
            ref={sidebarRef}
            id="navigation-atelier"
            className={`sidebar ${mobileOpen ? "sidebar--open" : ""}`}
          >
            <div className="sidebar-brand-row">
              <Brand />
              <Button
                className="mobile-close"
                variant="ghost"
                icon={X}
                aria-label="Fermer le menu"
                onClick={() => setMobileOpen(false)}
              />
            </div>
            <span className="sidebar-caption">VOTRE ESPACE</span>
            <nav aria-label="Navigation principale">
              {links.map(({ to, label, icon: Icon, view }) => (
                <Link
                  key={to}
                  to={to}
                  className={`sidebar-link ${["/", "/atelier"].includes(location.pathname) && selected === view ? "is-active" : ""}`}
                  aria-current={
                    ["/", "/atelier"].includes(location.pathname) &&
                    selected === view
                      ? "page"
                      : undefined
                  }
                >
                  <Icon size={19} />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="sidebar-note">
              <span>Une idée devient un monde.</span>
              <p>
                Vos règles. Vos héros.
                <br />
                Votre prochaine aventure.
              </p>
              <Compass size={36} strokeWidth={1} />
            </div>
            <div className="sidebar-bottom">
              <NavLink
                to="/user"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "is-active" : ""}`
                }
              >
                <Settings size={19} />
                Mon compte
              </NavLink>
              <details className="sidebar-library">
                <summary className="sidebar-link">
                  <BookOpen size={19} />
                  Bibliothèque
                  <ChevronDown size={13} />
                </summary>
                <Link to="/creation">Mes wikis</Link>
                <Link to="/caracters">Fiches libres</Link>
                <Link to="/discover">Découvrir les univers</Link>
              </details>
              {auth.user?.roles?.includes("ROLE_ADMIN") && (
                <Link className="sidebar-link" to="/admin/wiki">
                  <Shield size={19} />
                  Administration
                </Link>
              )}
              <button className="sidebar-link" onClick={signOut}>
                <LogOut size={19} />
                Déconnexion
              </button>
            </div>
            <div className="sidebar-profile">
              <span className="avatar">
                {(auth.user?.pseudo || "A").slice(0, 1).toUpperCase()}
              </span>
              <div>
                <strong>{auth.user?.pseudo || "Votre atelier"}</strong>
                <small>Maître de vos aventures</small>
              </div>
            </div>
          </aside>
        </>
      ) : (
        <header className="public-header">
          <Brand />
          <nav aria-label="Navigation principale">
            <Link to="/contact" className="public-contact">
              Contact
            </Link>
            <Link to="/login" className="text-link">
              Se connecter
            </Link>
            <Link to="/signup" className="ui-button ui-button--primary">
              Créer un compte
              <ArrowUpRight size={16} />
            </Link>
          </nav>
        </header>
      )}
      <div className="layout-content" inert={mobileOpen ? "" : undefined}>
        {connected && (
          <header className="workspace-topbar">
            <span>
              <span className="status-dot" />
              Votre espace personnel
            </span>
            <span className="topbar-note">
              Chaque aventure commence par une idée.
            </span>
            <Link
              to="/user"
              aria-label="Ouvrir mon compte"
              className="avatar avatar--small"
            >
              {(auth.user?.pseudo || "A").slice(0, 1).toUpperCase()}
            </Link>
          </header>
        )}
        <main
          id="page-content"
          className={core ? "page-content" : "page-content legacy-page"}
        >
          <Outlet />
        </main>
        <footer className="site-footer">
          <span>
            Forge JDR <span className="footer-dot">·</span> Vos mondes, vos
            règles.
          </span>
          <div>
            <Link to="/cgu">Conditions d’utilisation</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
