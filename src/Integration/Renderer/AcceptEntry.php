<?php declare(strict_types=1);

namespace Phpug\Web\Integration\Renderer;

final class AcceptEntry
{
	public function __construct(
		private MimeType $type,
		private int $quality,
	) {}

	public function getType(): MimeType
	{
		return $this->type;
	}

	public function getQuality(): int
	{
		return $this->quality;
	}

	public static function fromHeaderEntry(string $headerEntry): self
	{
		$parts = explode(';', $headerEntry);
		$type = MimeType::fromString($parts[0]);
		$quality = 100;
		if (count($parts) > 1) {
			foreach (array_slice($parts, 1) as $part) {
				$info = explode('=', $part);
				if (!$info[0] === 'q') {
					continue;
				}
				$quality = (int) ($info[1] * 100);
				break;
			}
		}

		return new self($type, $quality);
	}
}
