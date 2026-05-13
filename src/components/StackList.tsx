type StackListProps = {
	items: string[];
};

export function StackList({ items }: StackListProps) {
	return (
		<ul className="stack-list" aria-label="Project stack">
			{items.map((item) => (
				<li key={item}>{item}</li>
			))}
		</ul>
	);
}
