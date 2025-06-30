<?php declare(strict_types=1);

namespace Phpug\Web\Integration;

use League\Container\ServiceProvider\AbstractServiceProvider;
use Slim\App;

final class AppServiceProvider extends AbstractServiceProvider
{
	private null|App $app = null;

	public function setApp(App $app): void
	{
		$this->app = $app;
	}

	public function provides(string $id): bool
	{
		return $id === App::class;
	}

	public function register(): void
	{
		$this->getContainer()->add(App::class, function(){
			return $this->app;
		});
	}
}
