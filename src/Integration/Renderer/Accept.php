<?php declare(strict_types=1);

namespace Phpug\Web\Integration\Renderer;

use Psr\Http\Message\RequestInterface;

final class Accept
{
	private array $accepts;
	public function __construct(AcceptEntry ...$accepts)
	{
		$this->accepts = $accepts;
	}

	public function getAccepts(): array
	{
		return $this->accepts;
	}

	public static function fromRequest(RequestInterface $request): Accept
	{
		$parts = [];
		$accepts = $request->getHeader('Accept');
		{
			foreach ($accepts as $accept) {
				$strings = explode(',', $accept);
				foreach ($strings as $string) {
					$parts[] = AcceptEntry::fromHeaderEntry(trim($string));
				}
			}
		}

		return new self(...$parts);
	}

	public function matchList(MimeTypeList $mimeTypeList): int|false
	{
		$return = [];
		foreach ($this->accepts as $accept) {
			if (! $mimeTypeList->has($accept->getType())) {
				continue;
			}

			$return[] = $accept->getQuality();
		}

		rsort($return, SORT_NUMERIC);

		return reset($return);
	}
}
