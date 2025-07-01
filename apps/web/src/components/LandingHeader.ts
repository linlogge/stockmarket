import { Logo } from "./Logo";
import { LoginButton } from "./LoginButton";

export const LandingHeader = () => {
    const el = document.createElement('div');
    el.className = 'd-flex justify-content-between align-items-center mb-4';
    el.appendChild(Logo());
    el.appendChild(LoginButton());
    return el;
};
