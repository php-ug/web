<?php declare(strict_types=1);

namespace Phpug\Web\Integration\Renderer;

final class MimeType
{
	public function __construct(private string $major, private string $minor) {}

	public function getMajor(): string
	{
		return strtolower($this->major);
	}

	public function getMinor(): string
	{
		return strtolower($this->minor);
	}

	public function __toString(): string
	{
		return $this->getMajor() . '/' . $this->getMinor();
	}

	public function equals(object $other): bool
	{
		if (! $other instanceof MimeType) {
			return false;
		}

		return (string) $other === (string) $this;
	}

	public static function fromString(string $mimeType): MimeType
	{
		$parts = explode('/', $mimeType);
		if (count($parts) !== 2) {
			throw new \RuntimeException(sprintf('MimeType "%s" is invalid.', $mimeType));
		}
		return new self($parts[0], $parts[1]);
	}
}
