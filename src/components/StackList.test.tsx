import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StackList } from "./StackList";

describe("StackList", () => {
	it("renders stack labels", () => {
		render(<StackList items={["Astro", "React", "Sanity CMS"]} />);

		expect(screen.getByText("Astro")).toBeInTheDocument();
		expect(screen.getByText("React")).toBeInTheDocument();
		expect(screen.getByText("Sanity CMS")).toBeInTheDocument();
	});
});
