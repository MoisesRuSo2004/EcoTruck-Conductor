import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

import {
  FaMapMarkedAlt,
  FaHome,
  FaBullhorn,
  FaRoute,
  FaExclamationTriangle,
} from "react-icons/fa";

import Clock from "../Clock/Clock";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { logout } from "../../service/authService";

const navigation = [
  { name: "Dashboard", href: "/Dashboard", icon: FaHome },
  { name: "Iniciar Ruta", href: "/iniciarRuta", icon: FaMapMarkedAlt },
  { name: "Historial", href: "/historial", icon: FaRoute },
  { name: "Comunicados", href: "/comunicados", icon: FaBullhorn },
  { name: "Reportes", href: "/reportes", icon: FaExclamationTriangle },
];

export default function Navbar() {
  return (
    <Disclosure
      as="nav"
      className="backdrop-blur-md bg-[#3f3f3f]/80 border-b border-white/10 shadow-lg"
    >
      <div className="mx-auto px-4">
        <div className="flex h-20 items-center justify-between">

          {/* BOTÓN MÓVIL */}
          <div className="flex sm:hidden">
            <DisclosureButton className="p-2 text-gray-300 hover:text-white transition">
              <Bars3Icon className="block h-7 w-7 group-data-open:hidden" />
              <XMarkIcon className="hidden h-7 w-7 group-data-open:block" />
            </DisclosureButton>
          </div>

          {/* LOGO */}
          <a href="/Dashboard" className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center overflow-hidden">
              <img
                alt="EcoTruck"
                src="./images/logo/LogoEcoTruck.svg"
                className="h-8 w-8 object-contain"
              />
            </div>
            <span className="text-white font-semibold text-lg tracking-wide">
              EcoTruck
            </span>
          </a>

          {/* NAV DESKTOP */}
          <div className="hidden sm:flex space-x-2 ml-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition hover:bg-white/10"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </a>
            ))}
          </div>

          {/* PERFIL + HORA */}
          <div className="flex items-center gap-4">
            <Clock />

            <Menu as="div" className="relative">
              <MenuButton className="rounded-full p-[2px] bg-gradient-to-tr from-emerald-400 to-blue-500 hover:scale-105 transition shadow-md">
                <div className="rounded-full bg-[#3f3f3f] p-[2px]">
                  <img
                    alt="user avatar"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </div>
              </MenuButton>

              <MenuItems className="absolute right-0 mt-3 w-44 rounded-md bg-white shadow-xl py-1 border border-gray-100">
                <MenuItem>
                  <a
                    href="/perfil"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Perfil
                  </a>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => {
                      logout();
                      window.location.href = "/";
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      <DisclosurePanel className="sm:hidden px-4 pb-4 space-y-1">
        {navigation.map((item) => (
          <DisclosureButton
            key={item.name}
            as="a"
            href={item.href}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-white/10 hover:text-white"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </DisclosureButton>
        ))}
      </DisclosurePanel>
    </Disclosure>
  );
}
