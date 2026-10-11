import UiIcon from "../../components/ui/Icon/UiIcon";
const paths = {
    arrow: "M4 12h16m-6-6 6 6-6 6",
    book: "M3 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H3V4Zm18 0h-6a3 3 0 0 0-3 3v14a4 4 0 0 1 4-3h5V4Z",
    person: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    search: "M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 5 6 6",
    project: "M3 7h18v14H3V7Zm5 0V3h8v4M3 12h18m-11 0v4h4v-4",
    leaf: "M20 3C10 2 3 7 4 14c1 7 12 8 15-1 1-3 1-6 1-10ZM3 21 16 8",
    chevron: "M6 9l6 6 6-6",
    plus: "M12 4v16M4 12h16",
    check: "M5 12l4 4L19 6",
};

export default function CourseSymbol({ name }: { name: keyof typeof paths }) {
    if (name === "arrow" || name === "person" || name === "search" || name === "chevron" || name === "plus" || name === "check") return <UiIcon name={name} size={24} className="course-symbol" />;
    return <svg className="course-symbol" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={paths[name]} />
    </svg>;
}
