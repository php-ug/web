<?php declare(strict_types=1);

namespace Phpug\Web\Integration\Middleware;

use Phpug\Web\Application\DtoResponse;
use Phpug\Web\Integration\Renderer\Accept;
use Phpug\Web\Integration\Renderer\PossibleRenderers;
use Phpug\Web\Integration\Renderer\Renderer;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Routing\RouteContext;

final class DtoResponseConverter implements MiddlewareInterface
{
	private array $renderers;

	public function __construct(Renderer ...$renderer)
	{
		$this->renderers = $renderer;
	}

	public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
	{
		$response = $handler->handle($request);

		if (! $response instanceof DtoResponse) {
			return $response;
		}

		$renderer = $this->getRendererFromRequest($request);

		if (! $renderer instanceof Renderer) {
			return $response;
		}

		$routeContext = RouteContext::fromRequest($request);

		return $renderer->renderDto(
			$response->getDto(),
			$request->getAttribute('route')??'',
			$response
		);
	}

	private function getRendererFromRequest(ServerRequestInterface $request): Renderer|null
	{
		$accept = Accept::fromRequest($request);
		$possibleRenderers = new PossibleRenderers();
		foreach ($this->renderers as $renderer) {
			$quality = $accept->matchList($renderer->renders());
			if (false === $quality) {
				continue;
			}
			$possibleRenderers->add($renderer, $quality);
		}

		return $possibleRenderers->getBestRenderer();
	}

}
