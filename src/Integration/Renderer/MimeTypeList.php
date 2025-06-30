<?php declare(strict_types=1);

namespace Phpug\Web\Integration\Renderer;

final class MimeTypeList
{
	private array $mimeTypes;

	public function __construct(MimeType ...$mimetype)
	{
		$this->mimeTypes = $mimetype;
	}

	public function has(MimeType $mimetype): bool
	{
		foreach ($this->mimeTypes as $type) {
			if ($type->equals($mimetype)) {
				return true;
			}
		}

		return false;
	}
}
