<?php declare(strict_types=1);

namespace Phpug\Web\Integration\Renderer;

use Psr\Http\Message\ResponseInterface;
use Slim\App;
use Slim\Interfaces\RouteParserInterface;
use Slim\Routing\Route;
use Twig\Environment;

final class TextHtmlRenderer implements Renderer
{
	private null|App $app = null;
	public function __construct(
		private readonly Environment $twig,
	) {}

	public function setApp(App $app): void
	{
		$this->app = $app;
	}

	public function renders(): MimeTypeList
	{
		return new MimeTypeList(
			MimeType::fromString('text/html')
		);
	}

	public function renderDto(object $dto, Route $route, ResponseInterface $response): ResponseInterface
	{
		$routeName = $route->getName()??$route->getIdentifier();
		$template = $routeName . '.html.twig';

		$body = $response->getBody();
		$body->rewind();
		$body->write($this->twig->render($template, ['dto' => $dto, 'route' => $routeName]));

		return $response->withBody($body);

	}
}
