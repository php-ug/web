<?php declare(strict_types=1);

namespace Phpug\Web\Integration\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

final class Gravatar extends AbstractExtension
{
	public function getFunctions(): array
	{
		return [
			new TwigFunction('gravatar', [$this, 'gravatar']),
		];
	}

	public function gravatar(string $email, int $size = 200): string
	{
		$hash = hash( 'sha256', strtolower(trim($email)));

		return '<img width="' . $size . 'px" height="' . $size . 'px" src="https://www.gravatar.com/avatar/' . $hash . '?s=' . $size . '">';
	}
}
