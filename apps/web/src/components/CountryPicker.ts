import DE from "~icons/circle-flags/de";
import US from "~icons/circle-flags/us";

interface CountryPickerProps {
    locale?: "US" | "DE";
    onChange: (locale: "US" | "DE") => void;
}

const countries = [
    {
        code: "US",
        name: "United States",
        flag: US
    },
    {
        code: "DE",
        name: "Germany",
        flag: DE
    }
]

const CountryPicker = (props: CountryPickerProps) => {
    const el = document.createElement('div');
    el.className = "btn-group gap-2 mb-3 align-self-start";

    const buttons: { code: "US" | "DE"; element: HTMLButtonElement }[] = [];

    const updateActiveButton = (activeLocale: "US" | "DE" | undefined) => {
        buttons.forEach(button => {
            if (button.code === activeLocale) {
                button.element.classList.add('active');
            } else {
                button.element.classList.remove('active');
            }
        });
    };

    countries.forEach(country => {
        const button = document.createElement('button');
        button.className = "btn btn-outline-secondary icon-link";

        button.innerHTML = `${country.flag} ${country.name}`;
        button.addEventListener('click', () => {
            updateActiveButton(country.code as "US" | "DE");
            props.onChange(country.code as "US" | "DE");
        });
        buttons.push({ code: country.code as "US" | "DE", element: button });
        el.appendChild(button);
    });

    updateActiveButton(props.locale);

    return {
        element: el,
        setValue: (value: "US" | "DE") => {
            updateActiveButton(value);
        }
    };
}

export default CountryPicker;
