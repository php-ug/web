<?php declare(strict_types=1);

namespace Phpug\Web\Integration\Renderer;

final class PossibleRenderers
{
	private array $renderers = [];

	public function add(Renderer $renderer, int $quality): void
	{
		if (! isset($this->renderers[$quality]))
		$this->renderers[$quality] = $renderer;
	}

	public function addAcceptEntries(array $renderers): void
	{
		foreach ($renderers as $renderer) {}
	}

	public function getBestRenderer() : ?Renderer
	{
		if (count($this->renderers) === 0) {
			return null;
		}

		krsort($this->renderers);

		return reset($this->renderers);
	}
}
